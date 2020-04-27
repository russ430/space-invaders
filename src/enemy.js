export default class Enemy {
  constructor(x, y) {
    this.width = 30;
    this.height = 30;

    this.position = {
      x,
      y,
    };

    this.hits = 0;
  }

  draw(ctx) {
    ctx.fillStyle = '#87BFE3';
    if (this.hits > 0) {
      ctx.fillStyle = '#C80000';
    }
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {}
}
