import { Vector3 } from "three";
import Butterfly from "./Butterfly";

class ButterflyFactory {
  constructor(options) {
    this.boundaries = {
      width: 0,
      height: 0,
    };
    this.addToScene = options.addToScene;
    this.activeButterflies = [];
    this.idleButterflies = [];

    this.initButterflies();
  }

  /**
   * Iterate over every active butterfly and updates it
   * @param {Object} params
   * @param {Vector3} params.netPosition - Position of the player's net
   */
  update({ netPosition }) {
    /*
    this.activeButterflies.forEach((butterfly) => {
      butterfly.update(netPosition);
    });
    */
  }

  /**
   * This function needs to be called at every window resize.
   * It will redifine the XY range within butterflies can spawn
   * @param {Object} dimensions
   * @param {number} dimensions.width
   * @param {number} dimensions.height
   */
  updateBoundaries({ width, height }) {
    this.boundaries.width = width;
    this.boundaries.height = height;
  }

  /**
   * Instanciate ALL the butterflies and add them to the scene.
   * Butterflies aren't active yet but are ready to be spawned!
   */
  initButterflies() {
    for (let i = 0; i < 100; i++) {
      const butterfly = new Butterfly();
      this.addToScene(butterfly.mesh);
      this.idleButterflies.push(butterfly);
    }
  }

  spawnButterfly() {
    const maxSwarmCount = 20;
    if (this.idleButterflies.length > 0) {
      const swarmCount = Math.min(
        this.idleButterflies.length,
        Math.floor(Math.random() * maxSwarmCount)
      );
      const swarmPosition = {
        x: (Math.random() * 0.5 * this.boundaries.width) / 2,
        y: (Math.random() * 0.5 * this.boundaries.height) / 2,
      };

      const swarmWidth = 1;
      const swarmHeight = 1;
      const swarmSpeed = 0.01 + Math.random() * 0.1;

      console.log(`🦋 Spawning ${swarmCount} butterflies`);

      for (let i = 0; i < swarmCount; i++) {
        const butterfly = this.idleButterflies.pop();
        butterfly.spawn({
          x: swarmPosition.x + (Math.random() - 0.5) * swarmWidth,
          y: swarmPosition.y + (Math.random() - 0.5) * swarmHeight,
          z: -10 - Math.random() * 5 * i,
          speed: swarmSpeed,
        });
        this.activeButterflies.push(butterfly);
      }
    }
  }
}

export default ButterflyFactory;
