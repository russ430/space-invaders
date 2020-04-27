export function detectHit(object, enemy) {
  if (
    enemy.position.y + enemy.height >= object.position.y &&
    object.position.x >= enemy.position.x &&
    object.position.x <= enemy.position.x + enemy.width
  ) {
    return true;
  }
}
