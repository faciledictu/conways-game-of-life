import GameOfLifeController from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('game-of-life');
  const app = new GameOfLifeController(root, { rowCount: 100, colCount: 100, scale: 3 });

  app.init();
});
