import GameOfLifeModel from './model.js';
import GameOfLifeView from './view.js';

class GameOfLifeController {
  constructor(root, params) {
    this.model = new GameOfLifeModel(params);
    this.view = new GameOfLifeView(root, this.model);

    this.boardContainer = root.querySelector('.board-container');
    this.canvas = root.querySelector('.canvas');

    this.rowsInput = root.querySelector('.rows-input');
    this.colsInput = root.querySelector('.cols-input');
    this.scaleDownBtn = root.querySelector('.button-scale-down');
    this.scaleUpBtn = root.querySelector('.button-scale-up');

    this.clearBtn = root.querySelector('.button-clear');
    this.playBtn = root.querySelector('.button-play');
    this.stepBtn = root.querySelector('.button-step');
    this.randomizeBtn = root.querySelector('.button-randomize');
  }

  init() {
    this.boardContainer.addEventListener('mousedown', this.handleMouseDown);
    this.boardContainer.addEventListener('mousemove', this.handleMouseMove);
    this.boardContainer.addEventListener('mouseup', this.handleMouseUp);
    this.boardContainer.addEventListener('mouseleave', this.handleMouseLeave);

    this.rowsInput.addEventListener('change', this.handleChangeRows);
    this.colsInput.addEventListener('change', this.handleChangeCols);
    this.scaleDownBtn.addEventListener('click', this.handleChangeScale(-1));
    this.scaleUpBtn.addEventListener('click', this.handleChangeScale(1));

    this.clearBtn.addEventListener('click', this.model.clearBoard);
    this.playBtn.addEventListener('click', this.switchGameMode);
    this.stepBtn.addEventListener('click', this.model.updateBoard);
    this.randomizeBtn.addEventListener('click', this.model.fillBoardRandomly);
  }

  startGame() {
    const { minUpdateInterval } = this.model.state;
    this.model.state.isPlaying = true;

    const evolveBoard = async () => {
      await this.model.updateBoard();
      const remainingTime = minUpdateInterval - this.model.state.generationTime;
      const interval = Math.max(0, remainingTime);
      this.model.state.intervalId = setTimeout(evolveBoard, interval);
    };

    evolveBoard();
  }

  stopGame() {
    this.model.terminateBoardUpdate();
    clearTimeout(this.model.state.intervalId);
    this.model.state.isPlaying = false;
    this.model.state.intervalId = null;
  }

  switchGameMode = () => {
    if (this.model.state.isPlaying) {
      this.stopGame();
    } else {
      this.startGame();
    }
  };

  handleChangeScale = (value) => () => {
    this.model.setScale(this.model.state.scale + value);
  };

  handleChangeRows = (e) => {
    const rowCount = parseInt(e.target.value, 10);

    if (!Number.isNaN(rowCount)) {
      this.model.setRows(rowCount);
    }

    this.view.updateDimensions();
  };

  handleChangeCols = (e) => {
    const colCount = parseInt(e.target.value, 10);

    if (!Number.isNaN(colCount)) {
      this.model.setCols(colCount);
    }

    this.view.updateDimensions();
  };

  handleMouseDown = (e) => {
    this.model.state.isDrawing = true;
    this.handleMouseMove(e);
  };

  handleMouseUp = () => {
    this.model.state.isDrawing = false;
  };

  handleMouseLeave = () => {
    this.model.state.isDrawing = false;
  };

  handleMouseMove = (e) => {
    if (this.model.state.isDrawing) {
      const rect = this.view.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const isInsideBoard = x > 0 && x < rect.width && y > 0 && y < rect.height;
      if (isInsideBoard) {
        const col = Math.floor(x / this.model.state.scale);
        const row = Math.floor(y / this.model.state.scale);
        this.model.setCellState(row, col, true);
        this.view.redrawCell(row, col);
      }
    }
  };
}

export default GameOfLifeController;
