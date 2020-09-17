const TOP_KEYCODE = 38;
const RIGHT_KEYCODE = 39;
const BOTTOM_KEYCODE = 40;
const LEFT_KEYCODE = 37;
const SPACE_KEYCODE = 32;

const VELOCITY_MAX = 0.2;
const VELOCITY_STEP = 0.05;
const FRICTION = 0.9;

class PlayerControls {
  constructor() {
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false,
    };

    // Max velocity needs to beed a property of the PlayerControls object so we're able to retrieve
    // it from the player object
    this.maxVelocity = VELOCITY_MAX;
    this.velocity = {
      x: 0,
      y: 0,
    };

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyDown(e) {
    this.updateKey(e.keyCode, true);
  }

  onKeyUp(e) {
    this.updateKey(e.keyCode, false);
  }

  updateKey(keyCode, isDown) {
    switch (keyCode) {
      case TOP_KEYCODE:
        this.keys.up = isDown;
        break;
      case BOTTOM_KEYCODE:
        this.keys.down = isDown;
        break;
      case RIGHT_KEYCODE:
        this.keys.right = isDown;
        break;
      case LEFT_KEYCODE:
        this.keys.left = isDown;
        break;
      case SPACE_KEYCODE:
        this.keys.space = isDown;
        break;
    }
  }

  updateVelocity() {
    if (this.keys.up) {
      this.velocity.y = Math.min(this.velocity.y + VELOCITY_STEP, VELOCITY_MAX);
    }

    if (this.keys.down) {
      this.velocity.y = Math.max(
        this.velocity.y - VELOCITY_STEP,
        -VELOCITY_MAX
      );
    }

    if (this.keys.left) {
      this.velocity.x = Math.max(
        this.velocity.x - VELOCITY_STEP,
        -VELOCITY_MAX
      );
    }

    if (this.keys.right) {
      this.velocity.x = Math.min(this.velocity.x + VELOCITY_STEP, VELOCITY_MAX);
    }

    // Apply friction
    this.velocity.x *= FRICTION;
    this.velocity.y *= FRICTION;
  }
}

export default PlayerControls;
