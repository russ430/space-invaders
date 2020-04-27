export default class Enemy {
  constructor(x, y) {
    this.width = 30;
    this.height = 30;

    this.position = {
      x,
      y,
    };

    this.hit = false;
  }

  draw(ctx) {
    ctx.fillStyle = '#f00';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {}
}
