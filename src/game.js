import Player from "./player";
import ButtonPress from "./input";
import Bullet from "./bullet";
import Enemy from "./enemy";

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameObjects = [];
    this.bullets = [];
    this.enemies = [];
  }

  start() {
    for (let i = 0; i < 10; i++) {
      const enemy = new Enemy(i * 50, 300);
      this.enemies.push(enemy);
    }
    this.player = new Player(this);
    this.gameObjects.push(this.player);
    new ButtonPress(this);
  }

  shoot() {
    if (this.bullet) return;
    this.bullet = new Bullet(this);
  }

  update(deltaTime) {
    this.gameObjects.forEach(object => object.update(deltaTime));
    this.enemies.forEach(enemy => enemy.update(deltaTime));
    if (!this.bullet) return;
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].position.y + this.enemies[i].height >= this.bullet.position.y && this.bullet.position.x >= this.enemies[i].position.x && this.bullet.position.x <= this.enemies[i].position.x + this.enemies[i].width) {
        this.enemies[i].hit = true;
        this.bullet.hit = true;
      }
    }
    this.enemies = this.enemies.filter(enemy => enemy.hit === false);
    this.bullet.update(deltaTime);
    if (this.bullet.position.y < 0 || this.bullet.hit) this.bullet = null;

  }

  draw(ctx) {
    this.gameObjects.forEach(object => object.draw(ctx));
    this.enemies.forEach(enemy => enemy.draw(ctx));
    if (!this.bullet) return;
    this.bullet.draw(ctx);
  }
}