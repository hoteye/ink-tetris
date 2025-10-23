import { useState, useCallback, useEffect, useRef } from 'react';
import { Block } from './Block.js';
import {
  getNextType,
  want,
  mergeBlockToMatrix,
  clearFullLines,
  isOver,
  calculatePoints,
  Matrix,
} from './utils.js';
import { blankMatrix, speeds, eachLines, maxPoint, INVISIBLE_ROWS, BOARD_HEIGHT, BOARD_WIDTH } from './constants.js';

export type GameOverReason = 'topBlocked' | 'noSpace' | null;

export interface GameState {
  matrix: Matrix;
  currentBlock: Block | null;
  nextBlockType: string;
  score: number;
  lines: number;
  speedLevel: number;
  isPaused: boolean;
  isGameOver: boolean;
  gameOverReason: GameOverReason;
  isStarted: boolean;
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    matrix: blankMatrix.map((row) => [...row]),
    currentBlock: null,
    nextBlockType: getNextType(),
    score: 0,
    lines: 0,
    speedLevel: 1,
    isPaused: false,
    isGameOver: false,
    gameOverReason: null,
    isStarted: false,
  });

  const fallIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 开始游戏
  const startGame = useCallback(() => {
    const firstType = state.nextBlockType;
    const nextType = getNextType();

    setState({
      matrix: blankMatrix.map((row) => [...row]),
      currentBlock: new Block({ type: firstType as any }),
      nextBlockType: nextType,
      score: 0,
      lines: 0,
      speedLevel: 1,
      isPaused: false,
      isGameOver: false,
      gameOverReason: null,
      isStarted: true,
    });
  }, [state.nextBlockType]);

  // 暂停/继续
  const togglePause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  // 锁定方块并生成新方块
  const lockBlock = useCallback(() => {
    setState((prev) => {
      if (!prev.currentBlock || prev.isGameOver || prev.isPaused) {
        return prev;
      }

      console.log('[LOCK BLOCK] Locking block type:', prev.currentBlock.type, 'Position:', prev.currentBlock.xy);

      // 合并方块到矩阵
      let newMatrix = mergeBlockToMatrix(prev.currentBlock, prev.matrix);

      // 消除完整的行
      const { matrix: clearedMatrix, cleared } = clearFullLines(newMatrix);
      newMatrix = clearedMatrix;

      // 计算分数
      const points = calculatePoints(cleared, prev.speedLevel);
      const newScore = Math.min(prev.score + points + 10 + prev.speedLevel * 2, maxPoint);
      const newLines = prev.lines + cleared;

      // 计算新速度等级
      const newSpeedLevel = Math.min(Math.floor(newLines / eachLines) + 1, 6);

      // 生成新方块
      const nextBlock = new Block({ type: prev.nextBlockType as any });
      const nextNextType = getNextType();

      // 检查游戏是否结束，并记录失败原因
      let gameOverReason: GameOverReason = null;
      let gameOver = false;

      // 标准俄罗斯方块规则：
      // 1. 如果新方块无法放置在生成位置
      // 2. 且无法放置的原因是与可见区域（第INVISIBLE_ROWS行及以下）的方块重叠
      // 那么游戏结束
      if (!want(nextBlock, newMatrix)) {
        // 检查是否是因为与可见区域的方块重叠
        const { xy, shape } = nextBlock;
        let hasVisibleCollision = false;

        for (let k1 = 0; k1 < shape.length; k1++) {
          for (let k2 = 0; k2 < shape[k1].length; k2++) {
            const n = shape[k1][k2];
            const row = xy[0] + k1;
            const col = xy[1] + k2;

            // 如果方块的某个单元格在可见区域（row >= INVISIBLE_ROWS）
            // 且与已有方块重叠，则判定为游戏结束
            if (n && row >= INVISIBLE_ROWS && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
              if (newMatrix[row] && newMatrix[row][col]) {
                hasVisibleCollision = true;
                break;
              }
            }
          }
          if (hasVisibleCollision) break;
        }

        if (hasVisibleCollision) {
          gameOverReason = 'noSpace';
          gameOver = true;
          console.log('[GAME OVER] noSpace - Cannot place new block in visible area');
          console.log('Next block type:', prev.nextBlockType);
          console.log('Block position:', nextBlock.xy);
          console.log('Collision in visible area detected');
        }
      }

      // 即使方块能够生成，也要检查隐藏行是否被占据
      // 这是游戏结束的另一个标准条件
      if (!gameOver && isOver(newMatrix)) {
        gameOverReason = 'topBlocked';
        gameOver = true;
        console.log('[GAME OVER] topBlocked - Invisible rows occupied');
        console.log('Score:', prev.score, 'Lines:', prev.lines, 'Level:', prev.speedLevel);
        console.log('Invisible rows state:');
        newMatrix.slice(0, INVISIBLE_ROWS).forEach((row, i) => {
          const hasBlocks = row.some(cell => cell);
          console.log(`  Row ${i}: ${row.join('')} ${hasBlocks ? '← HAS BLOCKS' : ''}`);
        });
      }


      return {
        ...prev,
        matrix: newMatrix,
        currentBlock: gameOver ? null : nextBlock,
        nextBlockType: nextNextType,
        score: newScore,
        lines: newLines,
        speedLevel: newSpeedLevel,
        isGameOver: gameOver,
        gameOverReason,
      };
    });
  }, []);

  // 移动方块
  const moveBlock = useCallback((direction: 'left' | 'right' | 'down' | 'rotate') => {
    setState((prev) => {
      if (!prev.currentBlock || prev.isGameOver || prev.isPaused || !prev.isStarted) {
        return prev;
      }

      let nextBlock: Block;

      switch (direction) {
        case 'left':
          nextBlock = prev.currentBlock.left();
          break;
        case 'right':
          nextBlock = prev.currentBlock.right();
          break;
        case 'down':
          nextBlock = prev.currentBlock.fall();
          break;
        case 'rotate':
          nextBlock = prev.currentBlock.rotate();
          break;
      }

      // 检查是否可以移动
      if (want(nextBlock, prev.matrix)) {
        return { ...prev, currentBlock: nextBlock };
      }

      // 如果是向下移动且碰撞，锁定方块
      if (direction === 'down') {
        // 延迟锁定，在下一个 tick 执行
        setTimeout(lockBlock, 0);
      }

      return prev;
    });
  }, [lockBlock]);

  // 硬下落
  const hardDrop = useCallback(() => {
    setState((prev) => {
      if (!prev.currentBlock || prev.isGameOver || prev.isPaused || !prev.isStarted) {
        return prev;
      }

      let currentBlock = prev.currentBlock;
      let dropDistance = 0;

      // 找到最底部位置
      while (true) {
        const nextBlock = currentBlock.fall();
        if (!want(nextBlock, prev.matrix)) {
          break;
        }
        currentBlock = nextBlock;
        dropDistance++;
      }

      // 立即锁定
      setTimeout(lockBlock, 0);

      return { ...prev, currentBlock };
    });
  }, [lockBlock]);

  // 自动下落
  useEffect(() => {
    if (!state.isStarted || state.isPaused || state.isGameOver || !state.currentBlock) {
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current);
        fallIntervalRef.current = null;
      }
      return;
    }

    const speed = speeds[state.speedLevel - 1];

    fallIntervalRef.current = setInterval(() => {
      moveBlock('down');
    }, speed);

    return () => {
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current);
      }
    };
  }, [state.isStarted, state.isPaused, state.isGameOver, state.speedLevel, state.currentBlock, moveBlock]);

  return {
    state,
    startGame,
    togglePause,
    moveBlock,
    hardDrop,
  };
}
