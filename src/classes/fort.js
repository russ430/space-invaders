export default class Fort {
  constructor(x, y) {
    this.width = 60;
    this.height = 20;

    this.position = {
      x,
      y,
    };

    this.hits = 0;
  }

  update() {

  }

  draw(ctx) {
    ctx.fillStyle = '#00fc01';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}