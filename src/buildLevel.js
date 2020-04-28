/* eslint-disable no-plusplus */
import Enemy from './enemy';
import { levels } from './levels';

export function buildLevel(game, level) {
  const gameEnemies = [];

  const { enemiesPerRow, rows, stepSpeed } = levels[level];
  const spacePerEnemy = 35;
  const startingXPosition =
    (game.gameWidth - enemiesPerRow * spacePerEnemy) / 2;
  const startingYPosition = 150;
  const spacePerRow = 35;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < enemiesPerRow; j++) {
      const x = startingXPosition + spacePerEnemy * j;
      const y = startingYPosition + spacePerRow * i;
      const enemyType = i % 3;
      gameEnemies.push(new Enemy(x, y, stepSpeed, enemyType));
    }
  }

  return gameEnemies;
}
