// 方块形状定义 (与 react-tetris 保持一致)
export const blockShape = {
  I: [[1, 1, 1, 1]],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
};

// 旋转原点偏移 (SRS系统)
export const origin = {
  I: [[-1, 1], [1, -1]],
  L: [[0, 0]],
  J: [[0, 0]],
  Z: [[0, 0]],
  S: [[0, 0]],
  O: [[0, 0]],
  T: [[0, 0], [1, 0], [-1, 1], [0, -1]],
};

export type BlockType = keyof typeof blockShape;
export const blockTypes: BlockType[] = ['I', 'L', 'J', 'Z', 'S', 'O', 'T'];

// 游戏配置
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
// 顶部不可见行数（用于方块生成和过渡）
export const INVISIBLE_ROWS = 4;
// 显示的可见行数
export const VISIBLE_ROWS = BOARD_HEIGHT - INVISIBLE_ROWS;

// 速度等级配置 (毫秒)
export const speeds = [800, 650, 500, 370, 250, 160];
export const delays = [50, 60, 70, 80, 90, 100];

// 分数配置
export const clearPoints = [100, 300, 700, 1500]; // 1行, 2行, 3行, 4行

// 每消除20行增加一级速度
export const eachLines = 20;

// 最大分数
export const maxPoint = 999999;

// 空行和填充行
export const blankLine = Array(BOARD_WIDTH).fill(0);
export const fillLine = Array(BOARD_WIDTH).fill(1);

// 空矩阵
export const blankMatrix = Array(BOARD_HEIGHT)
  .fill(null)
  .map(() => [...blankLine]);

// 方块颜色
export const blockColors: Record<BlockType, string> = {
  I: 'cyan',
  O: 'yellow',
  T: 'magenta',
  S: 'green',
  Z: 'red',
  J: 'blue',
  L: 'white',
};
