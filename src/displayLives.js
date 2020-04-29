export default function displayLives(ctx, lives) {
  const image = document.getElementById('ship');
  const showLives = [];

  for (let i = 1; i <= lives; i++) {
    const x = -30 + i * 50;
    showLives.push(ctx.drawImage(image, x, 25, 40, 25));
  }
  return showLives;
}
