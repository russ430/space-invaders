/* eslint-disable no-plusplus */
/* eslint-disable no-new */
import Player from './player';
import ButtonPress from './input';
import Bullet from './bullet';
import Enemy from './enemy';
import { detectHit } from './detectHit';

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameObjects = [];
    this.bullets = [];
    this.enemies = [];
    this.score = 0;
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
    if (this.bullet) {
      for (let i = 0; i < this.enemies.length; i++) {
        if (detectHit(this.bullet, this.enemies[i])) {
          this.enemies[i].hit = true;
          this.bullet.hit = true;
          this.score += 10;
        }
      }
      this.enemies = this.enemies.filter(enemy => enemy.hit === false);
      this.bullet.update(deltaTime);
      if (this.bullet.position.y < 0 || this.bullet.hit) this.bullet = null;
    }
  }

  draw(ctx) {
    this.gameObjects.forEach(object => object.draw(ctx));
    this.enemies.forEach(enemy => enemy.draw(ctx));
    if (this.bullet) this.bullet.draw(ctx);

    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${this.score}`, this.gameWidth - 100, 50);
  }
}
