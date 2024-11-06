import { CubeTextureLoader, TextureLoader } from "three";

export const cubeTextureLoader = new CubeTextureLoader();
export const textureLoader = new TextureLoader();

const path = './assets/textures/cube/uhmlanga/';
const format = '.png';
const urls = [
  `${path}px${format}`, `${path}nx${format}`,
  `${path}py${format}`, `${path}ny${format}`,
  `${path}pz${format}`, `${path}nz${format}`
];

export const envMap = cubeTextureLoader.load(urls);
