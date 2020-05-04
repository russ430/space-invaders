import Game from './classes/game';

const canvas = document.getElementById('gameScreen');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const game = new Game(GAME_WIDTH, GAME_HEIGHT);

let lastTime = 0;

// max frames per second we want the game to run at
const maxFPS = 60;

// seconds per frame an update will take place
const timeStep = 1000 / maxFPS;

let deltaTime = 0;

function gameLoop(timestamp) {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // if the minimum amount of time needed to update hasn't been reached
  // we call game loop again until we have the necessary time to update
  // a frame --- this way we ensure the game runs in a smooth manner at
  // the frame rate we want
  if (timestamp < lastTime + 1000 / maxFPS) {
    requestAnimationFrame(gameLoop);
    return;
  }

  // increment delta time to include any leftover time from if statement above
  deltaTime += timestamp - lastTime;
  lastTime = timestamp;

  let numUpdateSteps = 0;
  while (deltaTime >= timeStep) {
    game.update(timeStep);
    deltaTime -= timeStep;
    numUpdateSteps += 1;
    // a check to mainly see if the user has navigated away from the
    // tab the game is running on, if it has the game will reset delta
    // after a specified time period (using numUpdateSteps) so as to not
    // create a 'spiral of death' that would make game hang
    if (numUpdateSteps >= 240) {
      deltaTime = 0;
      break;
    }
  }
  game.draw(ctx);
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
