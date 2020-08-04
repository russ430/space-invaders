// ---------- CLASSES ---------- //
import Player from './player';
import Bullet from './bullet';
import Bomb from './bomb';

// ---------- HELPER FUNCTIONS ---------- //
import {
  detectBulletHit,
  detectBombHit,
  detectEdge,
} from '../helpers/detections';
import createEnemies from '../helpers/createEnemies';
import createForts from '../helpers/createForts';
import displayLives from '../helpers/displayLives';
import setupKeyboardPress from '../controller/input';

// ---------- VARIABLES ---------- //
import levels from '../levels/levels';

const GAMESTATE = {
  PAUSED: Symbol('paused'),
  RUNNING: Symbol('running'),
  MENU: Symbol('menu'),
  GAMEOVER: Symbol('game over'),
  NEWLEVEL: Symbol('new level'),
  BEATGAME: Symbol('beat game'),
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameState = GAMESTATE.MENU;
    this.gameObjects = [];
    this.enemies = [];
    this.bombs = [];
    this.forts = [];
    this.player = new Player(this);
    this.enemyYPos = null;
    this.score = 0;
    this.level = 0;
    this.lives = 3;
    this.enemyStepDelay = 99999;
    this.enemyStepSpeed = levels[this.level].stepSpeed;

    setupKeyboardPress(this);
  }

  start() {
    if (this.level === levels.length) {
      this.gameState = GAMESTATE.BEATGAME;
    } else if (
      this.gameState !== GAMESTATE.MENU &&
      this.gameState !== GAMESTATE.NEWLEVEL
    ) {
      return;
    } else {
      this.lives = 3;
      this.enemies = createEnemies(this.gameWidth, levels[this.level]);
      this.forts = createForts(this, levels[this.level]);
      this.gameObjects = [this.player];
      this.gameState = GAMESTATE.RUNNING;
    }
  }

  shoot() {
    // if a bullet already exists do not create another
    if (this.bullet) return;
    this.bullet = new Bullet(
      this.player.position.x,
      this.player.position.y,
      this.player.width
    );
  }

  beatLevel() {
    this.level += 1;
    this.gameState = GAMESTATE.NEWLEVEL;
    this.start();
  }

  checkBombHit() {
    // check if a bomb has hit the player's ship
    for (let i = 0; i < this.bombs.length; i++) {
      const curBomb = this.bombs[i];
      if (detectBombHit(this.player, curBomb)) {
        this.bombs.splice(i, 1);
        this.lives -= 1;
      }
    }
  }

  checkGameStatus() {
    // if the enemies reach the player -> game over
    if (this.enemyYPos >= this.player.position.y) {
      this.gameState = GAMESTATE.GAMEOVER;
    }

    if (this.lives === 0) this.gameState = GAMESTATE.GAMEOVER;

    // the level is won if all of the enemies have been hit and removed
    if (this.enemies.length < 1) this.beatLevel();
  }

  updateBombs(secondsPassed) {
    this.enemyStepDelay += secondsPassed;
    // drop bomb from random enemy every step
    if (this.enemyStepDelay > this.enemyStepSpeed * secondsPassed) {
      const random = Math.floor(Math.random() * this.enemies.length);
      const { x, y } = this.enemies[random].position;
      const middleOfEnemy = x + 15;
      this.bombs.push(new Bomb(middleOfEnemy, y));
      this.enemyStepDelay = 0;
    }

    // remove bombs that are off screen
    this.bombs = this.bombs.filter(bomb => bomb.position.y < this.gameHeight);

    // check if a bomb hits a fort and delete it
    for (let i = 0; i < this.bombs.length; i++) {
      const curBomb = this.bombs[i];
      for (let j = 0; j < this.forts.length; j++) {
        if (detectBombHit(this.forts[j], curBomb)) {
          this.bombs.splice(i, 1);
          break;
        }
      }
    }
  }

  updateEnemies(secondsPassed) {
    this.enemies.forEach(enemy => enemy.update(secondsPassed));
    // if edge is detected shift enemies down
    if (detectEdge(this.enemies, this.gameWidth)) {
      for (let j = 0; j < this.enemies.length; j++) {
        this.enemies[j].shiftDown();
      }
    }

    // remove shot enemies from game
    this.enemies = this.enemies.filter(
      enemy => enemy.readyForDeletion === false
    );
  }

  checkBulletHits() {
    // check to see if the bullet has hit a fort
    for (let i = 0; i < this.forts.length; i++) {
      const curFort = this.forts[i];
      if (this.bullet) {
        if (detectBulletHit(this.bullet, curFort)) {
          this.bullet.hit = true;
        }
      }
    }

    // check if the bullet has hit an enemy
    for (let i = 0; i < this.enemies.length; i++) {
      const curEnemy = this.enemies[i];
      // store the last enemy's y position to use elsewhere
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
  }

  togglePause() {
    if (
      this.gameState === GAMESTATE.GAMEOVER ||
      this.gameState === GAMESTATE.BEATGAME
    )
      return;
    if (this.gameState === GAMESTATE.PAUSED) {
      this.gameState = GAMESTATE.RUNNING;
    } else {
      this.gameState = GAMESTATE.PAUSED;
    }
  }

  update(secondsPassed) {
    // no updates to the game should occur if the game state is
    // paused, at the menu, or the game is over
    if (
      this.gameState === GAMESTATE.PAUSED ||
      this.gameState === GAMESTATE.MENU ||
      this.gameState === GAMESTATE.GAMEOVER ||
      this.gameState === GAMESTATE.BEATGAME ||
      this.gameState === GAMESTATE.NEWLEVEL
    )
      return;

    // updating the game objects and player
    [...this.gameObjects, ...this.bombs].forEach(object =>
      object.update(secondsPassed)
    );

    this.checkGameStatus();
    this.checkBulletHits();
    this.checkBombHit();
    this.updateEnemies(secondsPassed);
    this.updateBombs(secondsPassed);

    // updating the bullet if it exists
    if (this.bullet) this.bullet.update(secondsPassed);
  }

  draw(ctx) {
    [
      ...this.gameObjects,
      ...this.enemies,
      ...this.bombs,
      ...this.forts,
    ].forEach(object => object.draw(ctx));
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

      ctx.font = '30px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(
        'How to Play:',
        this.gameWidth / 2,
        this.gameHeight / 2 + 180
      );

      ctx.font = '20px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(
        'SPACEBAR to shoot',
        this.gameWidth / 2,
        this.gameHeight / 2 + 230
      );

      ctx.font = '20px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(
        'LEFT and RIGHT arrows to move',
        this.gameWidth / 2,
        this.gameHeight / 2 + 255
      );

      ctx.font = '20px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(
        'ESC to pause',
        this.gameWidth / 2,
        this.gameHeight / 2 + 280
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

    if (this.gameState === GAMESTATE.BEATGAME) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fill();

      ctx.font = '30px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText('CONGRATULATIONS', this.gameWidth / 2, this.gameHeight / 2);
      ctx.fillText(
        "YOU'VE ELIMINATED ALL INVADERS",
        this.gameWidth / 2,
        this.gameHeight / 2 + 40
      );
    }

    ctx.font = '30px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Score: ${this.score}`, this.gameWidth / 2, 50);

    displayLives(ctx, this.lives);
  }
}
