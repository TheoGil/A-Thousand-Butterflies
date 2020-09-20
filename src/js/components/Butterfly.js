import {
  DoubleSide,
  Mesh,
  Object3D,
  PlaneGeometry,
  Math as ThreeMath,
  ShaderMaterial,
  TextureLoader,
} from "three";
import vertexShader from "../../shaders/butterflyWings/vertex.vert";
import fragmentShader from "../../shaders/butterflyWings/fragment.frag";
import wingTexture from "../../img/wings.png";

const WINGS_SPACING = 0.01;
const WINGS_HEIGHT = 1;
const WINGS_WIDTH = 0.75;
const WINGS_MIN_ANGLE = -ThreeMath.degToRad(25);
const WINGS_MAX_ANGLE = ThreeMath.degToRad(75);
const SCALE = 0.25;
const ANISOTROPY = 4;
const DEFAULT_SPEED = 1;

class Butterfly {
  constructor() {
    this.mesh = new Object3D();
    this.speed = DEFAULT_SPEED;
    this.initGeometry();
    new TextureLoader().load(wingTexture, (texture) => {
      this.initMaterial(texture);
      this.initMesh();
    });
  }

  initGeometry() {
    this.geometry = new PlaneGeometry(WINGS_WIDTH, WINGS_HEIGHT, 1, 1);
  }

  initMaterial(texture) {
    texture.anisotropy = ANISOTROPY;

    // Use a random starting time value so each butterfly flaps its wings
    // to a different tempo
    const time = Math.random() * 1000;

    // Randomly define if the fragment shader is going to use the red, green or blue
    // channel to draw the strokes of the wing
    const textureChannel = 0; //Math.floor(Math.random() * 3);

    this.leftWingMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
      uniforms: {
        u_texture: { type: "t", value: texture },
        u_texture_channel: { type: "f", value: textureChannel },
        u_flip_x: { type: "b", value: false },
        u_origin_x: { type: "f", value: WINGS_WIDTH / 2 },
        u_min_y_angle: { type: "f", value: -WINGS_MIN_ANGLE },
        u_max_y_angle: { type: "f", value: -WINGS_MAX_ANGLE },
        u_time: { type: "f", value: time },
        u_speed: { type: "f", value: this.speed },
      },
    });

    this.rightWingMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
      uniforms: {
        u_texture: { type: "t", value: texture },
        u_texture_channel: { type: "f", value: textureChannel },
        u_flip_x: { type: "b", value: true },
        u_origin_x: { type: "f", value: -WINGS_WIDTH / 2 },
        u_min_y_angle: { type: "f", value: WINGS_MIN_ANGLE },
        u_max_y_angle: { type: "f", value: WINGS_MAX_ANGLE },
        u_time: { type: "f", value: time },
        u_speed: { type: "f", value: this.speed },
      },
    });
  }

  initMesh() {
    console.log("LOADED");

    // Create left wing
    this.leftWing = new Mesh(this.geometry, this.leftWingMaterial);
    this.leftWing.position.x = -(WINGS_WIDTH / 2) - WINGS_SPACING / 2;

    // Create right wing
    this.rightWing = new Mesh(this.geometry, this.rightWingMaterial);
    this.rightWing.position.x = WINGS_WIDTH / 2 + WINGS_SPACING / 2;

    // Attach the wings onto the body
    this.mesh.add(this.leftWing, this.rightWing);
    // this.mesh.rotateX(ThreeMath.degToRad(-90));
    // this.mesh.rotateZ(ThreeMath.degToRad(180));
    // this.mesh.scale.set(SCALE, SCALE, SCALE);

    // Hide it until we spawn it
    // this.mesh.visible = false;
  }

  update(netPosition) {
    // this.mesh.position.z += this.speed;
    /*
    // We know that the player Z position won't change
    // We only have to check if the butterfly is within the range of the net
    // when it Z position reaches 0.
    if (this.mesh.position.z >= 0 && this.mesh.position.z <= 0.1) {
      // this.mesh.material.color = new Color(0x00ff00);

      const distance = netPosition.distanceTo(this.mesh.position);
      const netRadius = 0.5;
      if (distance < netRadius) {
        // this.mesh.material.color = new Color(0x0000ff);
      }
    }
    */
    if (this.leftWing && this.rightWing) {
      this.leftWing.material.uniforms.u_time.value += 1;
      this.rightWing.material.uniforms.u_time.value += 1;
    }
  }

  spawn({ x, y, z, speed }) {
    this.mesh.visible = true;
    this.mesh.position.set(x, y, z);
    this.speed = speed;
  }
}

export default Butterfly;
