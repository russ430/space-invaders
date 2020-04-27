export default class Enemy {
  constructor(x, y, threshold) {
    this.width = 30;
    this.height = 30;
    this.movementCounter = 0;
    this.movementThreshold = threshold;
    this.previous = 1;

    this.position = {
      x,
      y,
    };

    this.hits = 0;
  }

  draw(ctx) {
    ctx.fillStyle = '#555';
    if (this.hits > 0) {
      ctx.fillStyle = '#C80000';
    }
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.movementCounter += 1;
    if (this.movementCounter === this.movementThreshold - 10) {
      this.position.y += 20;
    }
    if (this.movementCounter === this.movementThreshold) {
      this.position.x += 20 * this.previous;
      this.previous *= -1;
      this.movementCounter = 0;
    }
  }
}
