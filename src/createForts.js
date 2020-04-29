import Fort from './fort';

export default function createForts(game, { forts }) {
  const gameForts = [];

  const spacePerFort = 140;
  const startingXPosition =
    (game.gameWidth - forts * spacePerFort) / 2 + spacePerFort / forts;
  const y = 500;

  for (let i = 0; i < forts; i++) {
    const x = startingXPosition + spacePerFort * i;
    gameForts.push(new Fort(x, y));
  }

  return gameForts;
}
