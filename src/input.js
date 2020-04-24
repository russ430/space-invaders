export default class ButtonPress {
  constructor({ player }) {
    document.addEventListener("keydown", event => {
      switch(event.keyCode) {
        case 37:
          player.moveLeft();
          break;
        case 39:
          player.moveRight();
          break;
        case 32:
          player.shoot();
          break;
      }
    })

    document.addEventListener("keyup", event => {
      switch(event.keyCode) {
        case 37:
          if (player.speed < 0) player.stop();
          break;
        case 39:
          if (player.speed > 0) player.stop();
          break;
      }
    })
  }
}