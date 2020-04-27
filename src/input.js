export default class ButtonPress {
  constructor(game) {
    document.addEventListener('keydown', event => {
      switch (event.keyCode) {
        case 37:
          game.player.moveLeft();
          break;
        case 39:
          game.player.moveRight();
          break;
        case 32:
          game.shoot();
          break;
        default:
      }
    });

    document.addEventListener('keyup', event => {
      switch (event.keyCode) {
        case 37:
          if (game.player.speed < 0) game.player.stop();
          break;
        case 39:
          if (game.player.speed > 0) game.player.stop();
          break;
        default:
      }
    });
  }
}
