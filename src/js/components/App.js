import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Math as ThreeMath,
} from "three";
import OrbitControls from "orbit-controls-es6";
import Clouds from "./Clouds";
import Player from "./Player";

class App {
  constructor() {
    console.clear();

    this.onResize = this.onResize.bind(this);
    this.render = this.render.bind(this);

    // An array of elements that are "updatables", wich need to be updated at every render loop
    this.updatables = [];

    this.initScene();
    this.initRenderer();
    this.initCamera();
    this.setRendererSize();
    this.addObjects();

    this.render();
  }

  initScene() {
    this.scene = new Scene();
  }

  initCamera() {
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 0.1;
    new OrbitControls(this.camera, this.renderer.domElement);
  }

  initRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: document.getElementById("js-canvas"),
      antialias: true,
    });
    this.renderer.setClearColor(0x9bd5ff);
    window.addEventListener("resize", this.onResize);
  }

  onResize() {
    this.setRendererSize();

    if (this.player.mesh) {
      console.log("1");
      this.player.updateBoundaries(this.computePlayerBoundaries());
    }
  }

  computePlayerBoundaries() {
    // We'd like this method to belong to the player class,
    // unfortunately, access to the camera object is needed.
    // So we need to update those value from here and pass them to the player object.
    const FOV = ThreeMath.degToRad(this.camera.fov);
    const height =
      2 * Math.tan(FOV / 2) * Math.abs(this.player.mesh.position.z);
    const width = height * this.camera.aspect;
    return { width, height };
  }

  setRendererSize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addObjects() {
    this.clouds = new Clouds();
    this.updatables.push(this.clouds);
    this.scene.add(this.clouds.mesh);

    this.player = new Player(() => {
      this.player.updateBoundaries(this.computePlayerBoundaries());
      this.updatables.push(this.player);
      this.scene.add(this.player.mesh);
    });
  }

  render() {
    requestAnimationFrame(this.render);

    this.updatables.forEach((updatable) => {
      updatable.update();
    });

    this.renderer.render(this.scene, this.camera);
  }
}

export default App;
