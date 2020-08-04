/* eslint-disable no-plusplus */
import Enemy from '../classes/enemy';

export default function createEnemies(
  width,
  { enemiesPerRow, rows, stepSpeed }
) {
  const gameEnemies = [];

  const spacePerEnemy = 35;
  const startingXPosition = (width - enemiesPerRow * spacePerEnemy) / 2;
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
