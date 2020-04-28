export default class Enemy {
  constructor(x, y, stepSpeed) {
    this.imageA = document.getElementById('enemy1a');
    this.imageB = document.getElementById('enemy1b');
    this.width = 25;
    this.height = 25;
    this.movementCounter = 0;
    this.stepSpeed = stepSpeed;
    this.direction = 1;
    this.movement = 1;
    this.step = 1;

    this.position = {
      x,
      y,
    };

    this.markedForDeletion = false;
  }

  draw(ctx) {
    ctx.drawImage(
      this.step < 0 ? this.imageA : this.imageB,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  shiftDown() {
    this.direction *= -1;
    this.position.y += 20;
    this.position.x += 10 * this.direction;
  }

  update() {
    this.movementCounter += 1;
    if (this.movementCounter === this.stepSpeed) {
      this.position.x += 10 * this.direction;
      this.movementCounter = 0;
      this.step *= -1;
    }
  }
}
