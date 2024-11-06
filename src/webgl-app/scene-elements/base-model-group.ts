import { Group } from "three";
import loader from "../loader";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export abstract class BaseModelGroup extends Group {

  constructor(protected modelUrl: string) {
    super();
    this.init(modelUrl);
  }

  public model!: Group;

  private init(modelUrl: string): void {
    this.loadModel(modelUrl);
    this.positionSelf();
  }

  protected loadModel(modelUrl: string) {
    loader.load(modelUrl, gltf => this.onLoad(gltf));
  }

  protected onLoad(gltf: GLTF) {
    this.model = gltf.scene;
    this.add(gltf.scene);
  }

  protected positionSelf(): void {}
}
