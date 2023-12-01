class GameOfLifeModel {
  constructor({
    rowCount = 30,
    colCount = 30,
    scale = 4,
    minUpdateInterval = 100,
  }) {
    this.onStateChange = () => {};
    this.state = new Proxy(
      {
        rowCount,
        colCount,
        scale,
        minUpdateInterval,
        board: null,
        intervalId: null,
        isDrawing: false,
        isPlaying: false,
        generation: 0,
        generationTime: null,
        renderTime: null,
        maxScale: 10,
        minScale: 1,
        maxCanvasDimension: 10000,
        maxBoardDimension: 10000,
        randomFactor: 0.125,
      },
      {
        set: (obj, prop, value) => {
          if (obj[prop] !== value) {
            Reflect.set(obj, prop, value);
            this.onStateChange(prop, value, obj);
          }

          return true;
        },
      }
    );

    this.clearBoard();
  }

  subscribeStateChange = (cb) => {
    this.onStateChange = cb;
  };

  setBoard = (board) => {
    this.state.board = board;
  };

  setCellState = (row, col, state) => {
    this.state.board[row][col] = state;
  };

  setScale = (scale) => {
    const { rowCount, colCount, maxCanvasDimension, minScale, maxScale } =
      this.state;

    const scaledWidth = scale * colCount;
    const scaledHeight = scale * rowCount;

    if (scaledWidth > maxCanvasDimension || scaledHeight > maxCanvasDimension) {
      this.state.scale = Math.min(
        maxCanvasDimension / colCount,
        maxCanvasDimension / rowCount
      );
    } else {
      this.state.scale = Math.max(
        minScale,
        Math.min(Math.floor(scale), maxScale)
      );
    }
  };

  setRows = (rowCount) => {
    this.state.rowCount = Math.min(rowCount, this.state.maxBoardDimension);
    this.clearBoard();
    this.setScale(this.state.scale);
  };

  setCols = (colCount) => {
    this.state.colCount = Math.min(colCount, this.state.maxBoardDimension);
    this.clearBoard();
    this.setScale(this.state.scale);
  };

  generateBoard = () =>
    new Array(this.state.rowCount)
      .fill(null)
      .map(() => new Array(this.state.colCount).fill(false));

  clearBoard = () => {
    this.state.generation = 0;
    this.state.generationTime = null;
    this.setBoard(this.generateBoard());
  };

  fillBoardRandomly = () => {
    const startTime = Date.now();
    const board = this.generateBoard().map((row) =>
      row.map(() => Math.random() < this.state.randomFactor)
    );
    const endTime = Date.now();
    this.state.generation = 0;
    this.state.generationTime = endTime - startTime;
    this.setBoard(board);
  };

  updateBoard = () =>
    new Promise((resolve, reject) => {
      this.updateBoardWorker = new Worker('/js/updateBoardWorker.js');

      this.updateBoardWorker.onmessage = (e) => {
        const { newBoard, generationTime } = e.data;
        this.setBoard(newBoard);
        this.state.generation += 1;
        this.state.generationTime = generationTime;
        resolve();
        this.updateBoardWorker.terminate();
      };

      this.updateBoardWorker.onerror = (error) => {
        reject(error);
        this.updateBoardWorker.terminate();
      };

      this.updateBoardWorker.postMessage({
        rowCount: this.state.rowCount,
        colCount: this.state.colCount,
        board: this.state.board,
        newBoard: this.generateBoard(),
      });
    });

  terminateBoardUpdate = () => {
    this.updateBoardWorker.terminate();
  };
}

export default GameOfLifeModel;
