export default class Enemy {
  constructor(x, y, stepSpeed, enemyType) {
    this.imageA = document.getElementById(`enemy${enemyType}a`);
    this.imageB = document.getElementById(`enemy${enemyType}b`);
    this.destroyed = document.getElementById('destroyed');
    this.width = 30;
    this.height = 25;
    this.stepSpeed = stepSpeed;
    this.direction = 1;
    this.movement = 1;
    this.step = 1;

    this.position = {
      x,
      y,
    };

    this.readyForDeletion = false;
    this.markedForDeletion = false;
  }

  draw(ctx) {
    let image;
    if (this.markedForDeletion) {
      image = this.destroyed;
    } else if (this.step < 0) {
      image = this.imageA;
    } else {
      image = this.imageB;
    }

    ctx.drawImage(
      image,
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

  walk() {
    this.position.x += 10 * this.direction;
    this.movementCounter = 0;
    this.step *= -1;

    if (this.markedForDeletion) {
      this.readyForDeletion = true;
    }
  }

  update(stepCounter) {
    if (stepCounter % this.stepSpeed === 0) {
      this.walk();
    }
  }
}
