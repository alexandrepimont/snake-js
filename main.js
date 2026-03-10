import main from './machine-learning/main.js';
import Game from './src/js/game.js';

document.addEventListener('DOMContentLoaded', async function () {
  const game = new Game();
  await main(game);

}, false);
