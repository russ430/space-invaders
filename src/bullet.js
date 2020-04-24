export default class Bullet {
  constructor(gameWidth, gameHeight) {
    this.width = 5;
    this.height = 20;

    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.position = {
      x: this.gameWidth / 2 - this.width / 2,
      y: this.gameHeight / 2,
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}