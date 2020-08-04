export default function setupKeyboardPress(game) {
  document.addEventListener('keydown', event => {
    switch (event.keyCode) {
      case 37:
        event.preventDefault();
        game.player.moveLeft();
        break;
      case 39:
        event.preventDefault();
        game.player.moveRight();
        break;
      case 32:
        event.preventDefault();
        game.shoot();
        break;
      case 27:
        event.preventDefault();
        game.togglePause();
        break;
      case 13:
        event.preventDefault();
        game.start();
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
