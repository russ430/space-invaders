export function detectHit(bullet, enemy) {
  if (
    enemy.position.y + enemy.height >= bullet.position.y &&
    bullet.position.x >= enemy.position.x &&
    bullet.position.x <= enemy.position.x + enemy.width
  ) {
    return true;
  }
}
