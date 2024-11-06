import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { BaseModelGroup } from "./base-model-group";
import { AnimationMixer } from "three";
import { Guiable } from "../interfaces/guiable";
import GUI from "lil-gui";

export class PlanetModel extends BaseModelGroup implements Guiable {
  
  mixer!: AnimationMixer;
  guiFolder?: GUI;

  constructor() {
    super('./assets/models/purple_planet.glb');
  }

  public update(delta: number) {
    this.mixer?.update(delta);
  }

  protected override onLoad(gltf: GLTF) {
    super.onLoad(gltf);
    this.initAnimation(gltf);
  }

  private initAnimation(gltf: GLTF) {
    this.mixer = new AnimationMixer(this.model);
    const animationAction = this.mixer.clipAction(gltf.animations[0]);
    animationAction.play();
    animationAction.timeScale = .25;
    this.guiFolder?.add(animationAction, 'timeScale', 0, 10, .01).name('animation speed');
  }

  protected override positionSelf() {
    this.position.set(-1245.23, 519.73, -1924.06);

    const s = 146.5;

    this.scale.set(s, s, s);
  }
}
