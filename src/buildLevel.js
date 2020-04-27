/* eslint-disable no-plusplus */
import Enemy from './enemy';
import { levels } from './levels';

export function buildLevel(game, level) {
  const gameEnemies = [];

  const { enemies, rows, threshold } = levels[level];
  const enemiesPerRow = enemies / rows;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < enemiesPerRow; j++) {
      const x = 150 + 50 * j;
      const y = 200 + 50 * i;
      gameEnemies.push(new Enemy(x, y, threshold));
    }
  }

  return gameEnemies;
}
