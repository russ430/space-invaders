/* eslint-disable no-plusplus */
export default function detectEdge(enemies, width) {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (enemy.position.x <= 0 || enemy.position.x + enemy.width >= width) {
      return true;
    }
  }
}
