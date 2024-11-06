import GUI from "lil-gui";
import { Object3D } from "three";
import gui from "../gui";
import { GuiManager } from "./gui-manager";
import { RefreshMode } from "./refresh-mode";
import { Guiable } from "../interfaces/guiable";

type GuiableObject = Object3D & Guiable;

export class GuiHelper {
  public static addDebugGUI(element: Object3D | GuiableObject, title?: string, refreshMode?: RefreshMode): GuiManager {
    const guiFolder = gui.addFolder(title || 'placeholder');
    const guiManager = new GuiManager(guiFolder);
    if ('guiFolder' in element) {
      element.guiFolder = guiFolder;
    }
    guiFolder.add(element, 'visible');
    GuiHelper.addPositionFolder(element, guiFolder);
    GuiHelper.addRotationFolder(element, guiFolder);
    GuiHelper.addScaleFolder(element, guiFolder);
    return guiManager;
  }

  protected static addPositionFolder(element: Object3D, guiFolder: GUI) {
    const posFolder = guiFolder.addFolder('Position');
    posFolder.add(element.position, 'x', -5000, 5000, .01);
    posFolder.add(element.position, 'y', -5000, 5000, .01);
    posFolder.add(element.position, 'z', -5000, 5000, .01);
  }

  protected static addRotationFolder(element: Object3D, guiFolder: GUI) {
    const rotationFolder = guiFolder.addFolder('Rotation');
    rotationFolder.add(element.rotation, 'x', -100, 100, .01);
    rotationFolder.add(element.rotation, 'y', -100, 100, .01);
    rotationFolder.add(element.rotation, 'z', -100, 100, .01);
  }
  
  static addScaleFolder(element: Object3D, guiFolder: GUI) {
    const scaleFolder = guiFolder.addFolder('Scale');
    
    GuiHelper.addXYZSlider(scaleFolder, 'all', 0.1, 1000, .1);
    scaleFolder.add(element.scale, 'x', 0.1, 1000, .1);
    scaleFolder.add(element.scale, 'y', 0.1, 1000, .1);
    scaleFolder.add(element.scale, 'z', 0.1, 1000, .1);
  }

  private static addXYZSlider(folder: GUI, varName: string, min?: number, max?: number, step?: number) {
    const obj = { [varName]: 1 };
    folder.add(obj, varName, min, max, step).onChange((newVal: number) => {
      const curr: any = folder.save();
      const controllers = curr.controllers;
      delete controllers[varName];
      const newValues = {
        ...curr,
        controllers: {
          ...controllers,
          x: newVal,
          y: newVal,
          z: newVal,
        }
      };

      folder.load(newValues);
    });
  }
}