import GUI from "lil-gui";
import settings from "./settings";

const gui = new GUI();
export default gui;

if (!settings.gui) {
  gui.hide();
}