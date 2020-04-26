import Player from "./player";
import ButtonPress from "./input";
import Bullet from "./bullet";

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameObjects = [];
    this.bullets = [];
  }

  start() {
    this.player = new Player(this);
    this.gameObjects.push(this.player);
    new ButtonPress(this);
  }

  shoot() {
    const bullet = new Bullet(this);
    this.bullets.push(bullet);
  }

  update(deltaTime) {
    this.gameObjects.forEach(object => object.update(deltaTime));
    this.bullets = this.bullets.filter(bullet => bullet.position.y > 0)
    this.bullets.forEach(bullet => bullet.update(deltaTime));
  }

  draw(ctx) {
    this.gameObjects.forEach(object => object.draw(ctx));
    this.bullets.forEach(bullet => bullet.draw(ctx));
  }
}