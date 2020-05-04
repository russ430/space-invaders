export default class Bullet {
  constructor(playerX, playerY, playerWidth) {
    this.width = 3;
    this.height = 12;

    this.maxSpeed = 13;

    this.position = {
      x: playerX + playerWidth / 2,
      y: playerY,
    };

    this.hit = false;
  }

  draw(ctx) {
    ctx.fillStyle = '#00fc01';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.y += -this.maxSpeed;
  }
}
