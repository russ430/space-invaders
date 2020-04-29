/* eslint-disable no-plusplus */

export function detectBulletHit(bullet, enemy) {
  if (
    enemy.position.y + enemy.height >= bullet.position.y &&
    bullet.position.x >= enemy.position.x &&
    bullet.position.x <= enemy.position.x + enemy.width
  ) {
    return true;
  }
}

export function detectBombHit(object, bomb) {
  if (
    bomb.position.y >= object.position.y &&
    bomb.position.x >= object.position.x &&
    bomb.position.x <= object.position.x + object.width
  ) {
    return true;
  }
}

export function detectEdge(enemies, width) {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (enemy.position.x <= 0 || enemy.position.x + enemy.width >= width) {
      return true;
    }
  }
}
