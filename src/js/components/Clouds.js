import {
  ShaderMaterial,
  Mesh,
  PlaneBufferGeometry,
  InstancedBufferGeometry,
  InstancedBufferAttribute,
  TextureLoader,
} from "three";
import mapRange from "../utilities/mapRange";
import vertexShader from "../../shaders/cloud/vertex.vert";
import fragmentShader from "../../shaders/cloud/fragment.frag";
import cloudTexture from "../../img/clouds.jpg";

const CLOUDS_FIELD_SIZE = 1000;
const CLOUDS_COUNT = 250;
const CLOUDS_PLANE_SIZE = 500;
const CLOUD_MIN_SCALE = 0.25;
const CLOUD_MAX_SCALE = 1;
const CLOUDS_TUNNEL_MAX_ANGLE = 180;
const CLOUDS_FIELD_DEPTH = -4000;
const FOG_NEAR = -500;
const FOG_FAR = -1000;

class Clouds {
  constructor() {
    this.initGeometry();
    this.initMaterial();
    this.initMesh();
  }

  initGeometry() {
    const planeBufferGeometry = new PlaneBufferGeometry(
      CLOUDS_PLANE_SIZE,
      CLOUDS_PLANE_SIZE,
      1,
      1
    );
    this.geometry = new InstancedBufferGeometry();
    this.geometry.attributes = planeBufferGeometry.attributes;
    this.geometry.index = planeBufferGeometry.index;

    const translateArray = new Float32Array(CLOUDS_COUNT * 3);
    const scaleArray = new Float32Array(CLOUDS_COUNT);
    const channelArray = new Float32Array(CLOUDS_COUNT);

    for (let i = 0; i < CLOUDS_COUNT; i++) {
      translateArray.set(
        [
          (Math.random() - 0.5) * CLOUDS_FIELD_SIZE,
          (Math.random() - 0.5) * CLOUDS_FIELD_SIZE,
          Math.random() * CLOUDS_FIELD_DEPTH,
        ],
        i * 3
      );

      scaleArray.set(
        [mapRange(Math.random(), 0, 1, CLOUD_MIN_SCALE, CLOUD_MAX_SCALE)],
        i
      );

      channelArray.set([Math.floor(Math.random() * 3)], i);
    }

    this.geometry.setAttribute(
      "translate",
      new InstancedBufferAttribute(translateArray, 3)
    );

    this.geometry.setAttribute(
      "scale",
      new InstancedBufferAttribute(scaleArray, 1)
    );

    this.geometry.setAttribute(
      "channel",
      new InstancedBufferAttribute(channelArray, 1)
    );
  }

  initMaterial() {
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: {
          value: 0.0,
        },
        u_time_scale: {
          value: 0.01,
        },
        u_max_depth: {
          value: CLOUDS_FIELD_DEPTH,
        },
        u_fog_near: {
          value: FOG_NEAR,
        },
        u_fog_far: {
          value: FOG_FAR,
        },
        u_texture: {
          value: new TextureLoader().load(cloudTexture),
        },
      },
      transparent: true,
      depthWrite: false,
      wireframe: false,
    });
  }

  initMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
  }

  update() {
    this.mesh.material.uniforms.u_time.value++;
  }
}

export default Clouds;
