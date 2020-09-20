import {
  CircleGeometry,
  Mesh,
  MeshBasicMaterial,
  Math as ThreeMath,
  Object3D,
  RingGeometry,
} from "three";

const NET_RADIUS = 0.5;
const NET_SEGMENTS = 32;
const NET_DISTANCE = 1.5;

class Net {
  constructor() {
    this.angle = 0;
    this.initGeometry();
    this.initMaterial();
    this.initMesh();
  }

  initGeometry() {
    // this.geometry = new CircleGeometry(NET_RADIUS, NET_SEGMENTS);
    this.geometry = new RingGeometry(NET_RADIUS - 0.05, NET_RADIUS);
  }

  initMaterial() {
    this.material = new MeshBasicMaterial({ color: 0xffff00 });
  }

  initMesh() {
    this.net = new Mesh(this.geometry, this.material);

    // Rotate the net so it matches the orientation of the plane
    this.net.rotation.y = ThreeMath.degToRad(-90);
    // Move the net up
    this.net.position.y = NET_DISTANCE;

    // Pivot point
    this.mesh = new Object3D();
    this.mesh.add(this.net);
  }

  update() {
    // this.angle += 0.01;
    // this.mesh.rotation.x = this.angle;
  }
}

export default Net;
