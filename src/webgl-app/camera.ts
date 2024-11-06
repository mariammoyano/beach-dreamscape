import { Camera, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import renderer from "./renderer";
import settings from "./settings";

export const devCamera = new PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight
);

export const mainCamera = new PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  2300
);

// Add OrbitControls
export const devControls = new OrbitControls(devCamera, renderer.domElement);
devControls.enableDamping = true;

export const mainControls = new OrbitControls(mainCamera, renderer.domElement);
mainControls.enabled = !settings.debugCamera;

export function limitMainControls(camera: Camera) {
  mainControls.enableDamping = true;
  mainControls.enablePan = false;
  mainControls.enableZoom = false;

  mainControls.minPolarAngle = 0.6314;
  mainControls.maxPolarAngle = 2.5635;
}
