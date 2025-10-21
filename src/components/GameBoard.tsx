import React from 'react';
import { Box, Text } from 'ink';
import { Block } from '../core/Block.js';
import { Matrix } from '../core/utils.js';
import { BOARD_WIDTH, BOARD_HEIGHT, blockColors, INVISIBLE_ROWS, VISIBLE_ROWS } from '../core/constants.js';

interface GameBoardProps {
  matrix: Matrix;
  currentBlock: Block | null;
  isGameOver?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ matrix, currentBlock, isGameOver = false }) => {
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

  // 计算 FAILURE 文本的位置（中间）
  const failureRow = Math.floor(VISIBLE_ROWS / 2);
  const failureText = 'FAILURE';
  const leftPadding = Math.floor((BOARD_WIDTH * 2 - failureText.length) / 2);
  const rightPadding = BOARD_WIDTH * 2 - failureText.length - leftPadding;

  return (
    <Box flexDirection="column">
      <Box>
        <Text>╔{'══'.repeat(BOARD_WIDTH)}╗</Text>
      </Box>
      {displayMatrix.slice(INVISIBLE_ROWS, INVISIBLE_ROWS + VISIBLE_ROWS).map((row, displayY) => {
        // 游戏结束时显示 FAILURE
        if (isGameOver && displayY === failureRow) {
          return (
            <Box key={displayY}>
              <Text>║</Text>
              <Text>{' '.repeat(leftPadding)}</Text>
              <Text bold color="red">{failureText}</Text>
              <Text>{' '.repeat(rightPadding)}</Text>
              <Text>║</Text>
            </Box>
          );
        }

        // 正常显示游戏板
        return (
          <Box key={displayY}>
            <Text>║</Text>
            {row.map((cell, x) => {
              if (cell === 2) {
                // 当前方块
                return (
                  <Text key={x} color={color}>
                    {'▓▓'}
                  </Text>
                );
              } else if (cell === 1) {
                // 已锁定的方块
                return (
                  <Text key={x} color="gray">
                    {'▓▓'}
                  </Text>
                );
              } else {
                // 空格
                return <Text key={x}>{'  '}</Text>;
              }
            })}
            <Text>║</Text>
          </Box>
        );
      })}
      <Box>
        <Text>╚{'══'.repeat(BOARD_WIDTH)}╝</Text>
      </Box>
    </Box>
  );
};
