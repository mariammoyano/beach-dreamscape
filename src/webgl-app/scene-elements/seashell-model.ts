import { BaseModelGroup } from "./base-model-group";

export class SeashellModel extends BaseModelGroup {

  constructor() {
    super('./assets/models/seashell.glb');
  }

  protected override positionSelf() {
    this.position.set(-118.14, 25.64, 27.72);
    this.rotation.set(0.75, -2.01, -0.26);

    const s = 45;
    this.scale.set(s, s, s);
  }
}
