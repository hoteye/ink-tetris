import React, { useEffect, useState } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { createRequire } from 'module';
import { useGameState } from './core/useGameState.js';
import { GameBoard } from './components/GameBoard.js';
import { NextBlock } from './components/NextBlock.js';
import { GameInfo } from './components/GameInfo.js';
import { Controls } from './components/Controls.js';
import { I18nContext } from './i18n/I18nContext.js';
import { t } from './i18n/languages.js';
import { loadConfig, saveConfig } from './utils/config.js';
const require = createRequire(import.meta.url);
const { version } = require('../package.json');
const App = () => {
    const { exit } = useApp();
    const { state, startGame, togglePause, moveBlock, hardDrop } = useGameState();
    const [language, setLanguage] = useState('en');
    const [isLoaded, setIsLoaded] = useState(false);
    // 在应用启动时加载配置
    useEffect(() => {
        const config = loadConfig();
        if (config.language) {
            setLanguage(config.language);
        }
        setIsLoaded(true);
    }, []);
    // 当语言改变时保存配置
    useEffect(() => {
        if (isLoaded) {
            const config = loadConfig();
            config.language = language;
            saveConfig(config);
        }
    }, [language, isLoaded]);
    // 键盘控制
    useInput((input, key) => {
        // 切换语言
        if (input === 'l' || input === 'L') {
            setLanguage((prev) => {
                const langs = ['en', 'zh', 'ja', 'ko', 'fr', 'es'];
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
        }
        else if (key.rightArrow) {
            moveBlock('right');
        }
        else if (key.downArrow) {
            moveBlock('down');
        }
        else if (key.upArrow) {
            moveBlock('rotate');
        }
        else if (input === ' ') {
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
    return (React.createElement(I18nContext.Provider, { value: { language, setLanguage } },
        React.createElement(Box, { flexDirection: "column", padding: 1, alignItems: "center" },
            React.createElement(Box, { marginBottom: 1, flexDirection: "column", alignItems: "center", width: 50 },
                React.createElement(Text, { bold: true, color: "cyan" }, t(language, 'title')),
                React.createElement(Text, { dimColor: true, color: "gray" },
                    "v",
                    version)),
            React.createElement(Box, null,
                React.createElement(Box, { marginRight: 2 },
                    React.createElement(GameBoard, { matrix: state.matrix, currentBlock: state.currentBlock, isGameOver: state.isGameOver })),
                React.createElement(Box, { flexDirection: "column", marginRight: 2 },
                    React.createElement(Box, { marginBottom: 1 },
                        React.createElement(NextBlock, { nextBlockType: state.nextBlockType })),
                    React.createElement(GameInfo, { score: state.score, lines: state.lines, level: state.speedLevel, isPaused: state.isPaused })),
                React.createElement(Box, null,
                    React.createElement(Controls, { shouldBlink: !state.isStarted || state.isGameOver, isPaused: state.isPaused }))))));
};
export default App;
