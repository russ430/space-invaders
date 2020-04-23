import Player from './player';
import ButtonPress from './input';

const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const player = new Player(GAME_WIDTH, GAME_HEIGHT);
new ButtonPress(player);

let lastTime = 0;

function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  player.update(deltaTime);
  player.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop();