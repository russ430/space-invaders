/* eslint-disable no-plusplus */
/* eslint-disable no-new */
import Player from './player';
import ButtonPress from './input';
import Bullet from './bullet';
import { detectBulletHit, detectBombHit, detectEdge } from './detections';
import { buildLevel } from './buildLevel';
import { levels } from './levels';
import Bomb from './bomb';

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
    this.bombs = [];
    this.player = new Player(this);
    this.enemyYPos = null;
    this.deltaTime = 0;
    this.score = 0;
    this.level = 0;
    this.lives = 3;
    this.enemyStepSpeed = levels[this.level].stepSpeed;
    new ButtonPress(this);
  }

  start() {
    this.lives = 3;
    this.deltaTime = 0;
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

    this.deltaTime += 1;

    // updating the game objects and player
    [...this.gameObjects, ...this.enemies, ...this.bombs].forEach(object =>
      object.update(this.deltaTime)
    );

    // checking if the bullet has hit an enemy or
    // if any enemies have reached the player
    for (let i = 0; i < this.enemies.length; i++) {
      const curEnemy = this.enemies[i];
      this.enemyYPos = this.enemies[i].position.y + this.enemies[i].height;
      if (this.bullet) {
        if (detectBulletHit(this.bullet, curEnemy)) {
          curEnemy.markedForDeletion = true;
          this.bullet.hit = true;
          this.score += 20;
        }
        // reset the bullet if it's out of the screen or if it's hit an enemy
        if (this.bullet.position.y < 0 || this.bullet.hit) this.bullet = null;
      }
    }

    if (this.deltaTime % (this.enemyStepSpeed + 10) === 0) {
      const random = Math.floor(Math.random() * this.enemies.length);
      const { x, y } = this.enemies[random].position;
      this.bombs.push(new Bomb(x, y));
    }

    // remove bombs that are off screen
    this.bombs = this.bombs.filter(bomb => bomb.position.y < this.gameHeight);

    for (let i = 0; i < this.bombs.length; i++) {
      const curBomb = this.bombs[i];
      if (detectBombHit(this.player, curBomb)) {
        this.bombs.splice(i, 1);
        this.lives -= 1;
      }
    }

    // only remove enemies when they walk in order to display
    // explosion image after being hit
    if (this.deltaTime % this.enemyStepSpeed === 0) {
      this.enemies = this.enemies.filter(
        enemy => enemy.markedForDeletion === false
      );
    }

    // if edge is detected shift enemies down
    if (detectEdge(this.enemies, this.gameWidth)) {
      for (let j = 0; j < this.enemies.length; j++) {
        this.enemies[j].shiftDown();
      }
    }

    // if the enemies reach the player -> game over
    if (this.enemyYPos >= this.player.position.y) {
      this.gameState = GAMESTATE.GAMEOVER;
    }

    if (this.bullet) this.bullet.update();

    // the level is won if all of the enemies have been hit and removed
    if (this.enemies.length < 1) this.win();
    if (this.lives === 0) this.gameState = GAMESTATE.GAMEOVER;
  }

  draw(ctx) {
    [...this.gameObjects, ...this.enemies, ...this.bombs].forEach(object =>
      object.draw(ctx)
    );
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

    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Lives: ${this.lives}`, 50, 50);
  }

  togglePause() {
    if (this.gameState === GAMESTATE.PAUSED) {
      this.gameState = GAMESTATE.RUNNING;
    } else {
      this.gameState = GAMESTATE.PAUSED;
    }
  }
}
