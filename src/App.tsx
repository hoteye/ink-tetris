import React, { useEffect, useState } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { createRequire } from 'module';
import { useGameState } from './core/useGameState.js';
import { GameBoard } from './components/GameBoard.js';
import { NextBlock } from './components/NextBlock.js';
import { GameInfo } from './components/GameInfo.js';
import { Controls } from './components/Controls.js';
import { I18nContext } from './i18n/I18nContext.js';
import { Language, t } from './i18n/languages.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json') as { version: string };

const App: React.FC = () => {
  const { exit } = useApp();
  const { state, startGame, togglePause, moveBlock, hardDrop } = useGameState();
  const [language, setLanguage] = useState<Language>('en');

  // 键盘控制
  useInput((input, key) => {
    // 切换语言
    if (input === 'l' || input === 'L') {
      setLanguage((prev) => {
        const langs: Language[] = ['en', 'zh', 'ja', 'ko', 'fr', 'es'];
        const currentIndex = langs.indexOf(prev);
        return langs[(currentIndex + 1) % langs.length];
      });
      return;
    }

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
    <I18nContext.Provider value={{ language, setLanguage }}>
      <Box flexDirection="column" padding={1} alignItems="center">
        {/* 标题与版本号 */}
        <Box marginBottom={1} flexDirection="column" alignItems="center" width={50}>
          <Text bold color="cyan">
            {t(language, 'title')}
          </Text>
          <Text dimColor color="gray">
            v{version}
          </Text>
        </Box>

        {/* 游戏区域 */}
        <Box>
          {/* 游戏板 */}
          <Box marginRight={2}>
            <GameBoard matrix={state.matrix} currentBlock={state.currentBlock} isGameOver={state.isGameOver} />
          </Box>

          {/* 中间栏：Next 和 Info */}
          <Box flexDirection="column" marginRight={2}>
            {/* 下一个方块 */}
            <Box marginBottom={1}>
              <NextBlock nextBlockType={state.nextBlockType} />
            </Box>

            {/* 游戏信息 */}
            <GameInfo
              score={state.score}
              lines={state.lines}
              level={state.speedLevel}
              isPaused={state.isPaused}
            />
          </Box>

          {/* 最右侧：控制说明 */}
          <Box>
            <Controls shouldBlink={!state.isStarted || state.isGameOver} />
          </Box>
        </Box>
      </Box>
    </I18nContext.Provider>
  );
};

export default App;
