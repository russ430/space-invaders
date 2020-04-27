/* eslint-disable no-plusplus */
/* eslint-disable no-new */
import Player from './player';
import ButtonPress from './input';
import Bullet from './bullet';
import { detectHit } from './detectHit';
import { buildLevel } from './buildLevel';

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
    this.gameState = GAMESTATE.MENU;
    this.gameObjects = [];
    this.enemies = [];
    this.player = new Player(this);

    this.score = 0;
    this.level = 0;
    new ButtonPress(this);
  }

  start() {
    this.enemies = buildLevel(this, this.level);
    this.gameObjects = [this.player];
    this.gameState = GAMESTATE.RUNNING;
  }

  shoot() {
    if (this.bullet) return;
    this.bullet = new Bullet(this);
  }

  win() {
    this.level += 1;
    this.gameState = GAMESTATE.NEWLEVEL;
    this.start();
  }

  update() {
    if (
      this.gameState === GAMESTATE.PAUSED ||
      this.gameState === GAMESTATE.MENU ||
      this.gameState === GAMESTATE.GAMEOVER
    )
      return;

    this.gameObjects.forEach(object => object.update());
    this.enemies.forEach(enemy => enemy.update());

    // checking if the bullet has hit an enemy or
    // if any enemies have reached the player
    for (let i = 0; i < this.enemies.length; i++) {
      const curEnemy = this.enemies[i];
      if (this.bullet) {
        if (detectHit(this.bullet, curEnemy)) {
          curEnemy.hits += 1;
          this.bullet.hit = true;
          this.score += 10;
        }
        this.enemies = this.enemies.filter(enemy => enemy.hits <= 1);
        if (this.bullet.position.y < 0 || this.bullet.hit) this.bullet = null;
      }
      if (curEnemy.position.y + curEnemy.height >= this.player.position.y) {
        this.gameState = GAMESTATE.GAMEOVER;
      }
    }

    if (this.bullet) this.bullet.update();
    if (this.enemies.length < 1) this.win();
  }

  draw(ctx) {
    [...this.gameObjects, ...this.enemies].forEach(object => object.draw(ctx));
    if (this.bullet) this.bullet.draw(ctx);

    if (this.gameState === GAMESTATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fill();

      ctx.font = '30px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText('Paused', this.gameWidth / 2, this.gameHeight / 2);
    }

    if (this.gameState === GAMESTATE.MENU) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fill();

      ctx.font = '30px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Press ENTER to start',
        this.gameWidth / 2,
        this.gameHeight / 2
      );
    }

    if (this.gameState === GAMESTATE.GAMEOVER) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fill();

      ctx.font = '30px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', this.gameWidth / 2, this.gameHeight / 2);
    }

    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`Score: ${this.score}`, this.gameWidth / 2, 50);
  }

  togglePause() {
    if (this.gameState === GAMESTATE.PAUSED) {
      this.gameState = GAMESTATE.RUNNING;
    } else {
      this.gameState = GAMESTATE.PAUSED;
    }
  }
}
