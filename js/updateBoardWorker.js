const findRegionOfLife = (params) => {
  let minRow = params.rowCount - 1;
  let maxRow = 0;
  let minCol = params.colCount - 1;
  let maxCol = 0;

  for (let i = 0; i < params.rowCount; i += 1) {
    for (let j = 0; j < params.colCount; j += 1) {
      if (params.board[i][j]) {
        minRow = Math.min(minRow, i);
        maxRow = Math.max(maxRow, i);
        minCol = Math.min(minCol, j);
        maxCol = Math.max(maxCol, j);
      }
    }
  }

  return {
    minRow,
    maxRow,
    minCol,
    maxCol,
  };
};

const countNeighbors = (row, col, params) => {
  let count = 0;
  for (let i = -1; i <= 1; i += 1) {
    for (let j = -1; j <= 1; j += 1) {
      if (i !== 0 || j !== 0) {
        const neighborRow = (row + i + params.rowCount) % params.rowCount;
        const neighborCol = (col + j + params.colCount) % params.colCount;

        if (params.board[neighborRow][neighborCol]) {
          count += 1;
        }
      }
    }
  }
  return count;
};

const updateBoard = (params) => {
  const { newBoard } = params;

  const { minRow, maxRow, minCol, maxCol } = findRegionOfLife(params);

  for (let i = minRow - 1; i <= maxRow + 1; i += 1) {
    for (let j = minCol - 1; j <= maxCol + 1; j += 1) {
      const row = (i + params.rowCount) % params.rowCount;
      const col = (j + params.colCount) % params.colCount;
      const neighbors = countNeighbors(row, col, params);
      if (neighbors === 3) {
        newBoard[row][col] = true;
      } else if (params.board[row][col] && neighbors === 2) {
        newBoard[row][col] = true;
      }
    }
  }

  return newBoard;
};

onmessage = (e) => {
  const startTime = Date.now();
  const newBoard = updateBoard(e.data);
  const endTime = Date.now();
  const generationTime = endTime - startTime;

  postMessage({ newBoard, generationTime });
};
