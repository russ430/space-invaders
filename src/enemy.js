export default class Enemy {
  constructor(x, y, stepSpeed, enemyType) {
    this.imageA = document.getElementById(`enemy${enemyType}a`);
    this.imageB = document.getElementById(`enemy${enemyType}b`);
    this.width = 30;
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
