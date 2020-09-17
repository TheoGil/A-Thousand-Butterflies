import Enemy from "./Enemy";

const ENEMIES_COUNT = 5;

class EnemiesFactory {
  constructor() {
    this.deadEnemies = [];
    this.aliveEnemies = [];

    for (let i = 0; i < ENEMIES_COUNT; i++) {
      const enemy = new Enemy();
      this.deadEnemies.push(enemy);
    }
  }

  spawn() {
    if (this.deadEnemies.length >= 1) {
      const enemy = this.deadEnemies.pop();
      enemy.spawn();
      this.aliveEnemies.push(enemy);
    }
  }

  onEnemyDeath() {}
}

export default EnemiesFactory;
