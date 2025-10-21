import React from 'react';
import { Box, Text } from 'ink';
import { Block } from '../core/Block.js';
import { Matrix } from '../core/utils.js';
import { BOARD_WIDTH, BOARD_HEIGHT, blockColors } from '../core/constants.js';

interface GameBoardProps {
  matrix: Matrix;
  currentBlock: Block | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({ matrix, currentBlock }) => {
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

  return (
    <Box flexDirection="column">
      <Box>
        <Text>╔{'══'.repeat(BOARD_WIDTH)}╗</Text>
      </Box>
      {displayMatrix.map((row, y) => (
        <Box key={y}>
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
      ))}
      <Box>
        <Text>╚{'══'.repeat(BOARD_WIDTH)}╝</Text>
      </Box>
    </Box>
  );
};
