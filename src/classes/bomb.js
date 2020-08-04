export default class Bomb {
  constructor(x, y) {
    this.width = 4;
    this.height = 15;

    this.maxSpeed = 320;

    this.position = {
      x,
      y,
    };

    this.markedForDeletion = false;
  }

  draw(ctx) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(secondsPassed) {
    this.position.y += this.maxSpeed * secondsPassed;
  }
}
