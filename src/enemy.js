export default class Enemy {
  constructor(x, y) {
    this.width = 30;
    this.height = 30;
    this.movementCounter = 0;
    this.moveDirection = 5;
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
    if (this.movementCounter === 190) {
      this.position.y += 20;
    }
    if (this.movementCounter === 200) {
      this.position.x += 20 * this.previous;
      this.previous *= -1;
      this.movementCounter = 0;
    }
  }
}
