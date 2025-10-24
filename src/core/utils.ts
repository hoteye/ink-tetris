import { Block } from './Block.js';
import { BlockType, blockTypes, BOARD_WIDTH, BOARD_HEIGHT, INVISIBLE_ROWS } from './constants.js';

export type Matrix = number[][];

// 获取随机方块类型
export function getNextType(): BlockType {
  return blockTypes[Math.floor(Math.random() * blockTypes.length)];
}

// 检查方块是否可以移动到指定位置
export function want(block: Block, matrix: Matrix): boolean {
  const { xy, shape } = block;
  const horizontal = shape[0].length;

  for (let k1 = 0; k1 < shape.length; k1++) {
    for (let k2 = 0; k2 < shape[k1].length; k2++) {
      const n = shape[k1][k2];

      // 检查左边界
      if (xy[1] < 0) {
        return false;
      }

      // 检查右边界
      if (xy[1] + horizontal > BOARD_WIDTH) {
        return false;
      }

      // 检查上边界 (react-tetris 风格: y < 0 的部分不检查碰撞，直接跳过)
      if (xy[0] + k1 < 0) {
        continue;
      }

      // 检查下边界
      if (xy[0] + k1 >= BOARD_HEIGHT) {
        return false;
      }

      // 检查是否与已有方块重叠（只对 y >= 0 的部分检查）
      if (n && matrix[xy[0] + k1][xy[1] + k2]) {
        return false;
      }
    }
  }

  return true;
}

// 检查是否有可以消除的行
export function isClear(matrix: Matrix): number[] | false {
  const clearLines: number[] = [];

  matrix.forEach((row, k) => {
    if (row.every((cell) => !!cell)) {
      clearLines.push(k);
    }
  });

  return clearLines.length === 0 ? false : clearLines;
}

// 检查游戏是否结束
// react-tetris 风格：只检查第0行（棋盘顶部）是否有方块
// 因为方块在 y < 0 时不会写入 matrix，所以 matrix[0] 有方块意味着已经堆到顶了
export function isOver(matrix: Matrix): boolean {
  return matrix[0].some((cell) => !!cell);
}

// 将方块合并到矩阵
export function mergeBlockToMatrix(block: Block, matrix: Matrix): Matrix {
  const newMatrix = matrix.map((row) => [...row]);
  const { xy, shape } = block;

  shape.forEach((row, k1) => {
    row.forEach((n, k2) => {
      if (n) {
        const y = xy[0] + k1;
        const x = xy[1] + k2;
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          newMatrix[y][x] = 1;
        }
      }
    });
  });

  return newMatrix;
}

// 消除已满的行
export function clearFullLines(matrix: Matrix): { matrix: Matrix; cleared: number } {
  const newMatrix = matrix.filter((row) => !row.every((cell) => !!cell));
  const cleared = BOARD_HEIGHT - newMatrix.length;

  // 在顶部添加空行
  while (newMatrix.length < BOARD_HEIGHT) {
    newMatrix.unshift(Array(BOARD_WIDTH).fill(0));
  }

  return { matrix: newMatrix, cleared };
}

// 计算得分
export function calculatePoints(linesCleared: number, speedLevel: number): number {
  const clearPoints = [0, 100, 300, 700, 1500];
  return clearPoints[linesCleared] || 0;
}
