import { BoxGeometry, Color, Mesh, MeshBasicMaterial } from "three";

class Enemy {
  constructor() {
    this.initGeometry();
    this.initMaterial();
    this.initMesh();
  }

  initGeometry() {
    this.geometry = new BoxGeometry(3, 3, 1);
  }

  initMaterial() {
    this.material = new MeshBasicMaterial({
      color: 0xff0000,
    });
  }

  initMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.layers.enable(1);
  }

  spawn() {
    this.material.color = new Color(0xff0000);
    this.health = 1;
    this.mesh.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      -25
    );
    this.material.color = new Color(0xff0000);
  }

  decreaseHealth(amount) {
    this.health -= amount;

    if (this.health < 0) {
      this.die();
    }
  }

  die() {}
}

export default Enemy;
