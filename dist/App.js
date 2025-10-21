import React, { useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { useGameState } from './core/useGameState.js';
import { GameBoard } from './components/GameBoard.js';
import { NextBlock } from './components/NextBlock.js';
import { GameInfo } from './components/GameInfo.js';
import { Controls } from './components/Controls.js';
const App = () => {
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
    return (React.createElement(Box, { flexDirection: "column", padding: 1, alignItems: "center" },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { bold: true, color: "cyan" }, "TETRIS - INK VERSION")),
        React.createElement(Box, null,
            React.createElement(Box, { marginRight: 2 },
                React.createElement(GameBoard, { matrix: state.matrix, currentBlock: state.currentBlock })),
            React.createElement(Box, { flexDirection: "column", marginRight: 2 },
                React.createElement(Box, { marginBottom: 2 },
                    React.createElement(NextBlock, { nextBlockType: state.nextBlockType })),
                React.createElement(GameInfo, { score: state.score, lines: state.lines, level: state.speedLevel, isPaused: state.isPaused, isGameOver: state.isGameOver })),
            React.createElement(Box, null,
                React.createElement(Controls, { shouldBlink: !state.isStarted || state.isGameOver })))));
};
export default App;
