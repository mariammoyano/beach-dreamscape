import { BaseModelGroup } from "./base-model-group";

export class SandModel extends BaseModelGroup {

  constructor() {
    super('./assets/models/sand_terrain.glb');
  }

  public override positionSelf(): void {
    this.position.set(-38.64, 0, 0);
    this.rotation.set(-0.01, 8.24, 0);
  }
}
