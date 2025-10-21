import React, { useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { useGameState } from './core/useGameState.js';
import { GameBoard } from './components/GameBoard.js';
import { NextBlock } from './components/NextBlock.js';
import { GameInfo } from './components/GameInfo.js';
import { Controls } from './components/Controls.js';

const App: React.FC = () => {
  const { exit } = useApp();
  const { state, startGame, togglePause, moveBlock, hardDrop } = useGameState();

  // 键盘控制
  useInput((input, key) => {
    // 退出
    if (input === 'q' || input === 'Q') {
      exit();
      return;
    }

    // 开始/重启游戏
    if ((input === 'r' || input === 'R')) {
      startGame();
      return;
    }

    // 如果游戏未开始，其他键无效
    if (!state.isStarted) {
      return;
    }

    // 暂停/继续
    if (input === 'p' || input === 'P') {
      togglePause();
      return;
    }

    // 游戏暂停或结束时，其他控制无效
    if (state.isPaused || state.isGameOver) {
      return;
    }

    // 移动控制
    if (key.leftArrow) {
      moveBlock('left');
    } else if (key.rightArrow) {
      moveBlock('right');
    } else if (key.downArrow) {
      moveBlock('down');
    } else if (key.upArrow) {
      moveBlock('rotate');
    } else if (input === ' ') {
      hardDrop();
    }
  });

  // 自动启动游戏
  useEffect(() => {
    if (!state.isStarted) {
      const timer = setTimeout(() => {
        // 首次不自动启动，显示欢迎界面
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state.isStarted, startGame]);

  return (
    <Box flexDirection="column" padding={1} alignItems="center">
      {/* 标题 */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          TETRIS - INK VERSION
        </Text>
      </Box>

      {/* 游戏区域 */}
      <Box>
        {/* 游戏板 */}
        <Box marginRight={2}>
          <GameBoard matrix={state.matrix} currentBlock={state.currentBlock} />
        </Box>

        {/* 中间栏：Next 和 Info */}
        <Box flexDirection="column" marginRight={2}>
          {/* 下一个方块 */}
          <Box marginBottom={2}>
            <NextBlock nextBlockType={state.nextBlockType} />
          </Box>

          {/* 游戏信息 */}
          <GameInfo
            score={state.score}
            lines={state.lines}
            level={state.speedLevel}
            isPaused={state.isPaused}
            isGameOver={state.isGameOver}
          />
        </Box>

        {/* 最右侧：控制说明 */}
        <Box>
          <Controls shouldBlink={!state.isStarted || state.isGameOver} />
        </Box>
      </Box>
    </Box>
  );
};

export default App;
