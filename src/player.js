export default class Player {
  constructor(gameWidth, gameHeight) {
    this.width = 50;
    this.height = 50;

    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    
    this.maxSpeed = 5;
    this.speed = 0;

    this.position = {
      x: gameWidth / 2 - this.width / 2,
      y: gameHeight - this.height,
    }

  }

  moveLeft() {
    this.speed = -this.maxSpeed;
  }

  moveRight() {
    this.speed = this.maxSpeed;
  }

  stop() {
    this.speed = 0;
  }

  draw(ctx) {
    ctx.fillStyle = "#03e";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(deltaTime) {
    if (!deltaTime) return;

    this.position.x += this.speed;

    if (this.position.x < 0) this.position.x = 0;
    if (this.position.x > this.gameWidth - this.width) this.position.x = this.gameWidth - this.width;
  }
}