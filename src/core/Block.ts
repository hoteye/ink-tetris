import { BlockType, blockShape, origin } from './constants.js';

export interface BlockData {
  type: BlockType;
  shape: number[][];
  xy: [number, number]; // [row, col]
  rotateIndex: number;
  timeStamp: number;
}

export class Block implements BlockData {
  type: BlockType;
  shape: number[][];
  xy: [number, number];
  rotateIndex: number;
  timeStamp: number;

  constructor(option: Partial<BlockData> & { type: BlockType }) {
    this.type = option.type;
    this.rotateIndex = option.rotateIndex ?? 0;
    this.timeStamp = option.timeStamp ?? Date.now();

    if (option.shape) {
      this.shape = option.shape;
    } else {
      // 初始化方块形状
      this.shape = blockShape[option.type].map(row => [...row]);
    }

    if (option.xy) {
      this.xy = option.xy;
    } else {
      // 初始位置 (与 react-tetris 保持一致)
      switch (option.type) {
        case 'I':
          this.xy = [0, 3];
          break;
        default:
          this.xy = [-1, 4];
          break;
      }
    }
  }

  // 旋转方块
  rotate(): Block {
    const result: number[][] = [];
    const shape = this.shape;

    // 转置矩阵实现旋转
    shape.forEach((row) =>
      row.forEach((n, colIndex) => {
        const newRowIndex = row.length - colIndex - 1;
        if (!result[newRowIndex]) {
          result[newRowIndex] = [];
        }
        result[newRowIndex].push(n);
      })
    );

    // 应用旋转偏移
    const originOffsets = origin[this.type];
    const currentOffset = originOffsets[this.rotateIndex];
    const nextXy: [number, number] = [
      this.xy[0] + currentOffset[0],
      this.xy[1] + currentOffset[1],
    ];

    const nextRotateIndex =
      (this.rotateIndex + 1) % originOffsets.length;

    return new Block({
      type: this.type,
      shape: result,
      xy: nextXy,
      rotateIndex: nextRotateIndex,
      timeStamp: this.timeStamp,
    });
  }

  // 下落
  fall(n = 1): Block {
    return new Block({
      type: this.type,
      shape: this.shape,
      xy: [this.xy[0] + n, this.xy[1]],
      rotateIndex: this.rotateIndex,
      timeStamp: Date.now(),
    });
  }

  // 向右移动
  right(): Block {
    return new Block({
      type: this.type,
      shape: this.shape,
      xy: [this.xy[0], this.xy[1] + 1],
      rotateIndex: this.rotateIndex,
      timeStamp: this.timeStamp,
    });
  }

  // 向左移动
  left(): Block {
    return new Block({
      type: this.type,
      shape: this.shape,
      xy: [this.xy[0], this.xy[1] - 1],
      rotateIndex: this.rotateIndex,
      timeStamp: this.timeStamp,
    });
  }
}
