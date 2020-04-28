export default class Bullet {
  constructor(game) {
    this.width = 3;
    this.height = 12;

    this.speed = 0;
    this.maxSpeed = 15;

    this.position = {
      x: game.player.position.x + game.player.width / 2,
      y: game.player.position.y,
    };

    this.hit = false;
  }

  draw(ctx) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.y += -this.maxSpeed;
  }
}
