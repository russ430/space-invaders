export default class Player {
  constructor(game) {
    this.image = document.getElementById('ship');
    this.width = 40;
    this.height = 25;

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.maxSpeed = 170;
    this.speed = 0;

    this.position = {
      x: game.gameWidth / 2 - this.width / 2,
      y: game.gameHeight - this.height - 10,
    };
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
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(secondsPassed) {
    this.position.x += this.speed * secondsPassed;

    // stop player when edge of game is reached
    if (this.position.x < 0) this.position.x = 0;
    if (this.position.x > this.gameWidth - this.width)
      this.position.x = this.gameWidth - this.width;
  }
}
