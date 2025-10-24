import assert from 'node:assert/strict';

import { blankMatrix, BOARD_HEIGHT, BOARD_WIDTH, INVISIBLE_ROWS } from '../dist/core/constants.js';
import { isOver } from '../dist/core/utils.js';

function createEmptyMatrix() {
  return blankMatrix.map((row) => [...row]);
}

function setCell(matrix, y, x, value = 1) {
  const copy = matrix.map((row, rowIndex) => (rowIndex === y ? [...row] : [...row]));
  copy[y][x] = value;
  return copy;
}

function run() {
  // 空棋盘不应失败
  {
    const matrix = createEmptyMatrix();
    assert.equal(isOver(matrix), false, 'empty matrix should not be game over');
  }

  // 在可见区最上面一行有方块也不应判负
  {
    const matrix = createEmptyMatrix();
    const visibleTopRow = INVISIBLE_ROWS; // 第一行可见行
    const updated = setCell(matrix, visibleTopRow, 0);
    assert.equal(isOver(updated), false, 'blocks in the first visible row should not trigger game over');
  }

  // react-tetris 风格：在第 0 行放置方块应判负
  {
    const matrix = createEmptyMatrix();
    const updated = setCell(matrix, 0, 0);
    assert.equal(isOver(updated), true, 'blocks in row 0 should trigger game over');
  }

  // react-tetris 风格：在任何其他行（行1+）放置方块不应判负
  // 因为 isOver() 只检查 matrix[0]
  {
    const matrix = createEmptyMatrix();
    const updated = setCell(matrix, 1, 0);
    assert.equal(isOver(updated), false, 'blocks in row 1 should NOT trigger game over (react-tetris style)');
  }

  // 在行2-3放置方块不应判负
  {
    const matrix = createEmptyMatrix();
    let updated = setCell(matrix, 2, 4);
    updated = setCell(updated, 2, 5);
    updated = setCell(updated, 3, 4);
    updated = setCell(updated, 3, 5);
    assert.equal(isOver(updated), false, 'blocks in rows 2-3 should not trigger game over');
  }

  // 在最后一个隐藏行（行3）放置方块不应判负
  {
    const matrix = createEmptyMatrix();
    const updated = setCell(matrix, INVISIBLE_ROWS - 1, BOARD_WIDTH - 1);
    assert.equal(isOver(updated), false, 'blocks in the last invisible row should not trigger game over');
  }

  // 即使可见区满了，只要隐藏行为空就应继续游戏
  {
    const matrix = createEmptyMatrix();
    for (let y = INVISIBLE_ROWS; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        matrix[y][x] = 1;
      }
    }
    assert.equal(isOver(matrix), false, 'full visible area without spawn blocks should not trigger game over');
  }

  console.log('isOver tests passed');
}

run();
