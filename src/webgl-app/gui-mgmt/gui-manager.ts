import GUI, { Controller } from "lil-gui";

export class GuiManager {
  constructor(public guiFolder: GUI) {}

  public open() { this.guiFolder?.open(); }

  public close() { this.guiFolder?.close(); }
}

export class MeshGuiManager extends GuiManager {
  sizeSlider?: Controller;
  colorPicker?: Controller;
}
