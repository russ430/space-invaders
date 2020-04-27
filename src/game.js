/* eslint-disable no-plusplus */
/* eslint-disable no-new */
import Player from './player';
import ButtonPress from './input';
import Bullet from './bullet';
import Enemy from './enemy';
import { detectHit } from './detectHit';

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameState = GAMESTATE.RUNNING;
    this.gameObjects = [];
    this.bullets = [];
    this.enemies = [];

    this.score = 0;
    this.level = 0;
  }

  start() {
    for (let i = 0; i < 3; i++) {
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

  win() {
    this.gameState = GAMESTATE.NEWLEVEL;
    console.log('win');
  }

  update(deltaTime) {
    if (
      this.gameState === GAMESTATE.PAUSED ||
      this.gameState === GAMESTATE.MENU ||
      this.gameState === GAMESTATE.GAMEOVER
    )
      return;

    this.gameObjects.forEach(object => object.update(deltaTime));
    this.enemies.forEach(enemy => enemy.update(deltaTime));
    if (this.bullet) {
      for (let i = 0; i < this.enemies.length; i++) {
        if (detectHit(this.bullet, this.enemies[i])) {
          this.enemies[i].hits += 1;
          this.bullet.hit = true;
          this.score += 10;
        }
      }
      this.enemies = this.enemies.filter(enemy => enemy.hits <= 2);
      this.bullet.update(deltaTime);
      if (this.bullet.position.y < 0 || this.bullet.hit) this.bullet = null;
    }
    if (this.enemies.length < 1) this.win();
  }

  draw(ctx) {
    [...this.gameObjects, ...this.enemies].forEach(object => object.draw(ctx));

    if (this.gameState === GAMESTATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fill();

      ctx.font = '30px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText('Paused', this.gameWidth / 2, this.gameHeight / 2);
    }

    if (this.bullet) this.bullet.draw(ctx);

    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`Score: ${this.score}`, 20, 50);
  }

  togglePause() {
    if (this.gameState === GAMESTATE.PAUSED) {
      this.gameState = GAMESTATE.RUNNING;
    } else {
      this.gameState = GAMESTATE.PAUSED;
    }
  }
}
