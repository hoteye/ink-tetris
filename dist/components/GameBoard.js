import React from 'react';
import { Box, Text } from 'ink';
import { BOARD_WIDTH, BOARD_HEIGHT, blockColors } from '../core/constants.js';
export const GameBoard = ({ matrix, currentBlock }) => {
    // 创建显示矩阵
    const displayMatrix = matrix.map((row) => [...row]);
    // 将当前方块添加到显示矩阵
    if (currentBlock) {
        const { xy, shape, type } = currentBlock;
        shape.forEach((row, k1) => {
            row.forEach((n, k2) => {
                if (n) {
                    const y = xy[0] + k1;
                    const x = xy[1] + k2;
                    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
                        displayMatrix[y][x] = 2; // 2 表示当前方块
                    }
                }
            });
        });
    }
    const color = currentBlock ? blockColors[currentBlock.type] : 'gray';
    return (React.createElement(Box, { flexDirection: "column" },
        React.createElement(Box, null,
            React.createElement(Text, null,
                "\u2554",
                '══'.repeat(BOARD_WIDTH),
                "\u2557")),
        displayMatrix.map((row, y) => (React.createElement(Box, { key: y },
            React.createElement(Text, null, "\u2551"),
            row.map((cell, x) => {
                if (cell === 2) {
                    // 当前方块
                    return (React.createElement(Text, { key: x, color: color }, '▓▓'));
                }
                else if (cell === 1) {
                    // 已锁定的方块
                    return (React.createElement(Text, { key: x, color: "gray" }, '▓▓'));
                }
                else {
                    // 空格
                    return React.createElement(Text, { key: x }, '  ');
                }
            }),
            React.createElement(Text, null, "\u2551")))),
        React.createElement(Box, null,
            React.createElement(Text, null,
                "\u255A",
                '══'.repeat(BOARD_WIDTH),
                "\u255D"))));
};
