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
    this.enemyYPos = null;

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
    // no updates to the game should occur if the game state is
    // paused, at the menu, or the game is over
    if (
      this.gameState === GAMESTATE.PAUSED ||
      this.gameState === GAMESTATE.MENU ||
      this.gameState === GAMESTATE.GAMEOVER
    )
      return;

    // updating the enemies and player
    [...this.gameObjects, ...this.enemies].forEach(object => object.update());

    // checking if the bullet has hit an enemy or
    // if any enemies have reached the player
    for (let i = 0; i < this.enemies.length; i++) {
      const curEnemy = this.enemies[i];
      this.enemyYPos = this.enemies[i].position.y;
      if (this.bullet) {
        if (detectHit(this.bullet, curEnemy)) {
          curEnemy.markedForDeletion = true;
          this.bullet.hit = true;
          this.score += 20;
        }
        // remove any enemies that have been hit
        this.enemies = this.enemies.filter(
          enemy => enemy.markedForDeletion === false
        );

        // reset the bullet if it's out of the screen or if it's hit an enemy
        if (this.bullet.position.y < 0 || this.bullet.hit) this.bullet = null;
      }
    }

    let edgeDetected = false;
    for (let j = 0; j < this.enemies.length; j++) {
      const enemy = this.enemies[j];
      if (
        enemy.position.x <= 0 ||
        enemy.position.x + enemy.width >= this.gameWidth
      ) {
        edgeDetected = true;
      }
    }

    if (edgeDetected) {
      for (let j = 0; j < this.enemies.length; j++) {
        this.enemies[j].shiftDown(edgeDetected);
      }
    }

    // if an enemy has reached the player: game over

    if (this.bullet) this.bullet.update();

    // the level is won if all of the enemies have been hit and removed
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
    ctx.fillStyle = '#fff';
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
