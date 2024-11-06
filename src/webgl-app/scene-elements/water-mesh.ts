import { PlaneGeometry, RepeatWrapping, Scene, Vector3 } from "three";
import { Water, WaterOptions } from "three/examples/jsm/objects/Water";
import { textureLoader } from "../texture";

export class WaterMesh extends Water {
  animation: { rippleSpeed: number, bob: number, bobSpeed?: number } = {
    bob: 2,
    bobSpeed: .5,
    rippleSpeed: .5
  }

  constructor(size: number = 1, scene: Scene) {
    const geometry = new PlaneGeometry(size, size);
    const waterOptions: WaterOptions = {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: textureLoader.load('./assets/textures/waternormals.jpg', function (texture) {
        texture.wrapS = texture.wrapT = RepeatWrapping; 
      }),
      sunDirection: new Vector3(),
      sunColor: 0xfefe00,
      waterColor: 0x7a63ee,
      distortionScale: 2.14,
      fog: scene.fog !== undefined
    };
    super(geometry, waterOptions);
    this.positionSelf();
  }

  public positionSelf(): void {
    this.position.set(-1500, .42, -1500);
    this.rotation.set(-Math.PI * 0.5, 0, 0.39);
  }

  public update(delta: number, elapsedTime: number) {
    const { rippleSpeed, bob, bobSpeed } = this.animation;

    this.material.uniforms[ 'time' ].value += (delta * rippleSpeed) ;
    this.animateBob(elapsedTime, bob, bobSpeed);
  }

  private animateBob(elapsedTime: number, bob: number, speedMod: number = 1) {
    this.position.y = Math.sin(elapsedTime * bob * speedMod) + 1;
  }
}