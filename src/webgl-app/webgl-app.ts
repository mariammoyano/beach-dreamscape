import {
  AmbientLight,
  AxesHelper,
  Camera,
  Clock,
  DirectionalLight,
  EulerOrder,
  GridHelper,
  Group,
  PerspectiveCamera,
  Vector4,
} from "three";
import renderer from "./renderer";
import { scene } from "./scene";
import { mainCamera, devCamera, devControls, mainControls, limitMainControls } from "./camera";
import gui from "./gui";
import settings from "./settings";
import Stats, { RenderStatsPosition } from "./stats";
import { WaterMesh } from "./scene-elements/water-mesh";
import { envMap } from "./texture";
import { SeashellModel } from "./scene-elements/seashell-model";
import { PlanetModel } from "./scene-elements/planet-model";
import { GuiHelper } from "./gui-mgmt/gui-helper";
import { SandModel } from "./scene-elements/sand-model";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let controls = settings.debugCamera ? devControls : mainControls;
export default class WebGLApp {
  viewport = { debug: new Vector4(), main: new Vector4() };
  stats?: Stats;
  clock = new Clock(true);
  water!: WaterMesh;
  seashellModel: SeashellModel;
  planetModel: PlanetModel;
  sandModel: SandModel;

  constructor(parent: HTMLElement) {
    this.assignControls(settings.debugCamera);
    parent.append(renderer.domElement);

    const statsWrapper = document.createElement("div");
    statsWrapper.classList.add("stats");
    document.body.appendChild(statsWrapper);
    
    this.initStats(statsWrapper);
    const helpers = this.initHelpers();
    
    const camPosition = [24.47, 16.4, 8.28];
    const camRotation: [number, number, number, EulerOrder?, ...any[]] = [-0.29, 1.12, 0.26];
    this.positionCamera(devCamera, camPosition, camRotation);
    this.positionCamera(mainCamera, camPosition, camRotation);
    this.setOrbitTarget(mainCamera, mainControls);
    limitMainControls(mainCamera);

    window.addEventListener("resize", this.resize);

    const ambientLight = new AmbientLight(0x404040);
    const directionLight = new DirectionalLight(0xffffff, 0.5);

    scene.add(ambientLight, directionLight);
    scene.background = envMap;
    scene.environment = envMap;
    
    this.water = new WaterMesh(5000, scene);
    scene.add(this.water);

    this.seashellModel = new SeashellModel();
    scene.add(this.seashellModel);
    
    this.planetModel = new PlanetModel();
    scene.add(this.planetModel);

    this.sandModel = new SandModel();
    scene.add(this.sandModel);
    
    this.addGui(helpers);

    // Start update
    this.resize();
    this.update();
  }

  addGui = (helpers: Group) => {
    if (settings.gui) {
      this.addGeneralGui(helpers);
      this.addElementsGui();
    }
  }

  resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Resize renderer
    devCamera.aspect = width / height;
    devCamera.updateProjectionMatrix();
    mainCamera.aspect = width / height;
    mainCamera.updateProjectionMatrix();

    renderer.setSize(width, height);

    this.viewport.debug.set(0, 0, width * 0.25, height * 0.25);
    this.viewport.main.set(0, 0, width, height);
  };

  renderScene = (camera: PerspectiveCamera, viewport: Vector4) => {
    renderer.setViewport(viewport);
    renderer.setScissor(viewport);
    renderer.render(scene, camera);
  };

  update = () => {
    // Render scene
    requestAnimationFrame(this.update);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    this.planetModel.update(delta);
    this.water.update(delta, elapsedTime);

    controls.update();

    if (settings.debugCamera) {
      this.renderScene(devCamera, this.viewport.main);
      this.renderScene(mainCamera, this.viewport.debug);
    } else {
      this.renderScene(mainCamera, this.viewport.main);
    }

    this.stats?.update(renderer);
    renderer.info.reset();
  };

  private initHelpers() {
    const helpers = new Group();
    if (settings.helpers) {
      helpers.add(new AxesHelper(1), new GridHelper(10, 10));
      scene.add(helpers);
    }
    return helpers;
  }

  private initStats(statsWrapper: HTMLDivElement) {
    if (settings.stats) {
      this.stats = new Stats({
        parent: statsWrapper,
        position: {
          alignment: RenderStatsPosition.TopLeft,
          x: 1,
          y: 1,
          unit: "rem",
        },
      });
    }
  }

  private addElementsGui() {
    GuiHelper.addDebugGUI(this.planetModel, 'Planet').close();
    GuiHelper.addDebugGUI(this.sandModel, 'Sand').close();
    GuiHelper.addDebugGUI(this.seashellModel, 'Seashell').close();
    const waterGui = GuiHelper.addDebugGUI(this.water, 'Water');
    waterGui.guiFolder.add(this.water.animation, 'rippleSpeed', 0, 2, .01);
    waterGui.guiFolder.add(this.water.animation, 'bob', 0, 10, .01);
    waterGui.guiFolder.add(this.water.animation, 'bobSpeed', 0, 1, .01);
    waterGui.guiFolder.addColor(this.water.material.uniforms.waterColor, 'value');
    waterGui.close();
  }

  private addGeneralGui(helpers: Group) {
    gui.add(settings, "debugCamera").onChange((v: boolean) => {
      mainControls.enabled = !v;
      this.assignControls(v);
    });
    gui.add(helpers, "visible").name("helpers");
    GuiHelper.addDebugGUI(mainCamera, 'Camera').close();

    const controlsGui = gui.addFolder('Orbit Controls').close();
    const PI2 = 2 * Math.PI;
    controlsGui.add(mainControls, 'minAzimuthAngle', -PI2, PI2);
    controlsGui.add(mainControls, 'maxAzimuthAngle', -PI2, PI2);
    controlsGui.add(mainControls, 'minPolarAngle', 0, Math.PI);
    controlsGui.add(mainControls, 'maxPolarAngle', 0, Math.PI);
  }

  private assignControls(debug: boolean) {
    controls = debug ? devControls : mainControls;
  }

  private positionCamera(camera: Camera, camPosition: number[], camRotation: [number, number, number, (EulerOrder | undefined)?, ...any[]]) {
    camera.position.fromArray(camPosition);
    camera.rotation.fromArray(camRotation);
  }

  private setOrbitTarget(camera: Camera, orbitControls: OrbitControls, targetDistance: number = 1) {
    const lookAt = new Group();

    lookAt.position.copy( camera.position );
    lookAt.rotation.copy( camera.rotation );
    lookAt.updateMatrix();
    lookAt.translateZ( -targetDistance );
    lookAt.updateMatrix();

    orbitControls.target = lookAt.position;
    camera.lookAt(lookAt.position);
  }
}
