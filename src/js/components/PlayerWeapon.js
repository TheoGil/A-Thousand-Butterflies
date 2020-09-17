import {
  CylinderGeometry,
  Mesh,
  Math as ThreeMath,
  Raycaster,
  ArrowHelper,
  Vector3,
  ShaderMaterial,
} from "three";
import fragmentShader from "../../shaders/bullet/fragment.frag";
import vertexShader from "../../shaders/bullet/vertex.vert";

const RAY_RADIUS = 0.05;
const RAY_LENGTH = 25;

class PlayerWeapon {
  constructor() {
    this.arrowHelperDirection = new Vector3(0, 0, -1);
    this.initGeometry();
    this.initMaterial();
    this.initMesh();
    this.initRaycaster();
  }

  initGeometry() {
    this.geometry = new CylinderGeometry(RAY_RADIUS, RAY_RADIUS, RAY_LENGTH);
  }

  initMaterial() {
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        u_time: {
          value: 0,
        },
        u_beam_opacity: {
          value: 0,
        },
      },
    });
  }

  initMesh() {
    this.mesh = new Mesh(this.geometry, this.material);

    // Rotate and move the mesh so it looks like it is coming from the nose of the plane
    this.mesh.position.x = RAY_LENGTH / 2;
    this.mesh.rotation.z = ThreeMath.degToRad(90);

    // ARROW HELPER
    this.arrowHelper = new ArrowHelper(
      this.arrowHelperDirection,
      new Vector3(0, 0, 0),
      RAY_LENGTH,
      0x00ff00
    );
  }

  initRaycaster() {
    this.raycaster = new Raycaster();
    this.raycaster.layers.set(1);
  }

  update({ position, rotation }) {
    // UPDATE ARROW HELPER
    // POSITION
    this.arrowHelper.position.x = position.x;
    this.arrowHelper.position.y = position.y;
    this.arrowHelper.position.z = position.z;

    // ROTATION
    this.arrowHelperDirection.x = rotation.x;
    this.arrowHelperDirection.y = rotation.y;
    this.arrowHelperDirection.z = rotation.z;
    this.arrowHelper.setDirection(this.arrowHelperDirection);

    // UPDATE RAYCASTER ORIGIN AND DIRECTION
    this.raycaster.set(position, this.arrowHelperDirection);
  }
}

export default PlayerWeapon;
