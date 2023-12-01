const PLAY_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="icon" fill="currentColor" viewBox="0 0 16 16">
<path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
</svg>`;

const PAUSE_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="icon" fill="currentColor" viewBox="0 0 16 16">
<path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
</svg>`;

class GameOfLifeView {
  constructor(root, model) {
    this.maxCanvasArea = 100000000;
    this.model = model;
    this.root = root;
    this.canvas = root.querySelector('.canvas');
    this.canvasContext = this.canvas.getContext('2d');
    this.rowsInput = root.querySelector('.rows-input');
    this.colsInput = root.querySelector('.cols-input');
    this.playBtn = root.querySelector('.button-play');
    this.stepBtn = root.querySelector('.button-step');
    this.generationCounter = root.querySelector('.generation-count');
    this.generationTimer = root.querySelector('.generation-time');

    this.handleIsPlaying();
    this.updateDimensions();
    this.updateGenerationCount();
    this.updateGenerationTimer();
    this.drawBoard();
    this.model.subscribeStateChange(this.render);
  }

  handleIsPlaying() {
    if (this.model.state.isPlaying) {
      this.root.classList.add('playing');
      this.playBtn.innerHTML = PAUSE_ICON;
      this.rowsInput.readOnly = true;
      this.colsInput.readOnly = true;
      this.stepBtn.disabled = true;
    } else {
      this.root.classList.remove('playing');
      this.playBtn.innerHTML = PLAY_ICON;
      this.rowsInput.readOnly = false;
      this.colsInput.readOnly = false;
      this.stepBtn.disabled = false;
    }
  }

  updateDimensions() {
    this.rowsInput.value = this.model.state.rowCount;
    this.colsInput.value = this.model.state.colCount;
  }

  drawBoard() {
    const { scale } = this.model.state;
    this.canvas.width = this.model.state.colCount * scale;
    this.canvas.height = this.model.state.rowCount * scale;
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.fillStyle = window.getComputedStyle(this.canvas).getPropertyValue('color');

    for (let i = 0; i < this.model.state.rowCount; i += 1) {
      for (let j = 0; j < this.model.state.colCount; j += 1) {
        if (this.model.state.board[i][j]) {
          const y = i * scale;
          const x = j * scale;
          this.canvasContext.fillRect(x, y, scale, scale);
        }
      }
    }
  }

  redrawCell(row, col) {
    const { scale } = this.model.state;
    const y = row * scale;
    const x = col * scale;
    if (this.model.state.board[row][col]) {
      this.canvasContext.fillRect(x, y, scale, scale);
    } else {
      this.canvasContext.clearRect(x, y, scale, scale);
    }
  }

  updateGenerationCount() {
    this.generationCounter.textContent = this.model.state.generation;
  }

  updateGenerationTimer() {
    const time = this.model.state.generationTime;
    this.generationTimer.textContent = time !== null ? `${time} мс` : '—';
  }

  render = (prop) => {
    switch (prop) {
      case 'rowCount':
      case 'colCount':
        this.updateDimensions();
        break;

      case 'scale':
        this.drawBoard();
        break;

      case 'isPlaying':
        this.handleIsPlaying();
        break;

      case 'board':
        this.drawBoard();
        break;

      case 'generation':
        this.updateGenerationCount();
        break;

      case 'generationTime':
        this.updateGenerationTimer();
        break;

      default:
        break;
    }
  };
}

export default GameOfLifeView;
