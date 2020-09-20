import { Math as ThreeMath, Mesh, MeshBasicMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import model from "../../models/plane.glb";
import PlayerControls from "./PlayerControls";
import mapRange from "../utilities/mapRange";
import Net from "./Net";

const ROTATION_Y_INITIAL = ThreeMath.degToRad(90);
const ROTATION_MAX_X = ThreeMath.degToRad(45);
const ROTATION_MAX_Y = ThreeMath.degToRad(45);

class Player {
  constructor(onLoadCallback) {
    this.boundaries = {
      x: {
        min: 0,
        max: 0,
      },
      y: {
        min: 0,
        max: 0,
      },
    };

    this.onLoadCallback = onLoadCallback;
    this.onModelLoaded = this.onModelLoaded.bind(this);
    this.initLoader();
    this.controls = new PlayerControls();
    this.net = new Net();

    this.xVel = 0;
    this.yVel = 0;

    this.loader.load(model, this.onModelLoaded);
  }

  initLoader() {
    this.loader = new GLTFLoader();
  }

  onModelLoaded(data) {
    const defaultMesh =
      data.scene.children[0].children[0].children[0].children[0];

    // Creat a new mesh from the loaded model, that will use its geometry but a different material
    const material = new MeshBasicMaterial({
      map: defaultMesh.material.map,
    });
    const geometry = defaultMesh.geometry.clone();
    this.mesh = new Mesh(geometry, material);

    // Rotate mesh so it face the horizon
    this.mesh.rotation.y = ROTATION_Y_INITIAL;

    // Attach net to player
    this.mesh.add(this.net.mesh);

    this.onLoadCallback();
  }

  updateBoundaries(dimensions) {
    this.boundaries.x.min = -dimensions.width / 2;
    this.boundaries.x.max = dimensions.width / 2;
    this.boundaries.y.min = -dimensions.height / 2;
    this.boundaries.y.max = dimensions.height / 2;
  }

  update() {
    this.controls.updateVelocity();

    this.mesh.position.x += this.controls.velocity.x;
    this.mesh.position.y += this.controls.velocity.y;

    this.mesh.rotation.x = mapRange(
      this.controls.velocity.y,
      -0.2,
      0.2,
      -ROTATION_MAX_X,
      ROTATION_MAX_X
    );

    this.mesh.rotation.y =
      ROTATION_Y_INITIAL +
      mapRange(
        this.controls.velocity.x,
        0.2,
        -0.2,
        -ROTATION_MAX_Y,
        ROTATION_MAX_Y
      );

    // Clamp player's position
    if (this.mesh.position.x < this.boundaries.x.min) {
      this.mesh.position.x = this.boundaries.x.min;
    } else if (this.mesh.position.x > this.boundaries.x.max) {
      this.mesh.position.x = this.boundaries.x.max;
    }
    if (this.mesh.position.y < this.boundaries.y.min) {
      this.mesh.position.y = this.boundaries.y.min;
    } else if (this.mesh.position.y > this.boundaries.y.max) {
      this.mesh.position.y = this.boundaries.y.max;
    }

    // Update net
    this.net.update();
  }
}

export default Player;
