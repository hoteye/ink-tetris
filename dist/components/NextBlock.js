import React, { useContext } from 'react';
import { Box, Text } from 'ink';
import { blockShape, blockColors } from '../core/constants.js';
import { I18nContext } from '../i18n/I18nContext.js';
import { t } from '../i18n/languages.js';
export const NextBlock = ({ nextBlockType }) => {
    const { language } = useContext(I18nContext);
    const shape = blockShape[nextBlockType];
    const color = blockColors[nextBlockType];
    if (!shape) {
        return null;
    }
    // 内容宽度：减少 20%，从 6 降到约 5 个方块位置
    const CONTENT_WIDTH = 5; // 5 个方块位置
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", paddingX: 1, paddingY: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { bold: true, color: "cyan" }, t(language, 'next'))),
        shape.map((row, y) => {
            // 计算左右填充以居中显示
            const blockWidth = row.length;
            const leftPadding = Math.floor((CONTENT_WIDTH - blockWidth) / 2);
            const rightPadding = CONTENT_WIDTH - blockWidth - leftPadding;
            return (React.createElement(Box, { key: y },
                leftPadding > 0 && Array(leftPadding).fill(0).map((_, i) => (React.createElement(Text, { key: `left-${i}` }, '  '))),
                row.map((cell, x) => cell ? (React.createElement(Text, { key: x, color: color }, "\u2593\u2593")) : (React.createElement(Text, { key: x }, "  "))),
                rightPadding > 0 && Array(rightPadding).fill(0).map((_, i) => (React.createElement(Text, { key: `right-${i}` }, '  ')))));
        })));
};
