import React, { useContext } from 'react';
import { Box, Text } from 'ink';
import { blockShape, blockColors, BlockType } from '../core/constants.js';
import { I18nContext } from '../i18n/I18nContext.js';
import { t } from '../i18n/languages.js';

interface NextBlockProps {
  nextBlockType: string;
}

export const NextBlock: React.FC<NextBlockProps> = ({ nextBlockType }) => {
  const { language } = useContext(I18nContext);
  const shape = blockShape[nextBlockType as BlockType];
  const color = blockColors[nextBlockType as BlockType];

  if (!shape) {
    return null;
  }

  // 内容宽度：减少 20%，从 6 降到约 5 个方块位置
  const CONTENT_WIDTH = 5; // 5 个方块位置

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1} paddingY={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {t(language, 'next')}
        </Text>
      </Box>
      {shape.map((row, y) => {
        // 计算左右填充以居中显示
        const blockWidth = row.length;
        const leftPadding = Math.floor((CONTENT_WIDTH - blockWidth) / 2);
        const rightPadding = CONTENT_WIDTH - blockWidth - leftPadding;

        return (
          <Box key={y}>
            {/* 左侧填充 */}
            {leftPadding > 0 && Array(leftPadding).fill(0).map((_, i) => (
              <Text key={`left-${i}`}>{'  '}</Text>
            ))}
            {/* 方块 */}
            {row.map((cell, x) =>
              cell ? (
                <Text key={x} color={color}>
                  ▓▓
                </Text>
              ) : (
                <Text key={x}>  </Text>
              )
            )}
            {/* 右侧填充 */}
            {rightPadding > 0 && Array(rightPadding).fill(0).map((_, i) => (
              <Text key={`right-${i}`}>{'  '}</Text>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};
