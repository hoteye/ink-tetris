import React, { useState, useEffect, useContext } from 'react';
import { Box, Text } from 'ink';
import { I18nContext } from '../i18n/I18nContext.js';
import { t } from '../i18n/languages.js';
import { VISIBLE_ROWS } from '../core/constants.js';
export const Controls = ({ shouldBlink = false, isPaused = false }) => {
    const { language } = useContext(I18nContext);
    const [showBlink, setShowBlink] = useState(true);
    useEffect(() => {
        if (!shouldBlink && !isPaused) {
            setShowBlink(true);
            return;
        }
        const interval = setInterval(() => {
            setShowBlink((prev) => !prev);
        }, 500); // 每 500ms 切换一次
        return () => clearInterval(interval);
    }, [shouldBlink, isPaused]);
    // 计算填充行数
    // GameBoard 高度 = 上框 (1) + 内容 (VISIBLE_ROWS) + 下框 (1) = VISIBLE_ROWS + 2 = 18
    // Controls 内容行数 = 标题 (1) + 控制说明 (9) + 边框/填充 = 约 11-12 行
    // 需要添加空行使总高度达到 18 行
    const GAMEBOARD_HEIGHT = VISIBLE_ROWS + 2; // 上下框各 1 行
    const controlsContentLines = 11; // 标题 1 + 控制说明 9 + 边界 1
    const paddingNeeded = Math.max(0, GAMEBOARD_HEIGHT - controlsContentLines - 2); // -2 for padding borders
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "round", borderColor: "blue", padding: 1, width: 22, height: GAMEBOARD_HEIGHT },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { bold: true, color: "cyan" }, t(language, 'controls'))),
        React.createElement(Box, { flexDirection: "column" },
            React.createElement(Text, { dimColor: true, wrap: "truncate" },
                React.createElement(Text, { color: "yellow" }, t(language, 'leftRight')),
                " : ",
                t(language, 'move')),
            React.createElement(Text, { dimColor: true, wrap: "truncate" },
                React.createElement(Text, { color: "yellow" }, t(language, 'up')),
                " : ",
                t(language, 'rotate')),
            React.createElement(Text, { dimColor: true, wrap: "truncate" },
                React.createElement(Text, { color: "yellow" }, t(language, 'down')),
                " : ",
                t(language, 'softDrop')),
            React.createElement(Text, { dimColor: true, wrap: "truncate" },
                React.createElement(Text, { color: "yellow" }, t(language, 'space')),
                " : ",
                t(language, 'hardDrop')),
            isPaused && showBlink ? (React.createElement(Text, { bold: true, color: "yellow", backgroundColor: "red", wrap: "truncate" },
                React.createElement(Text, { color: "yellow" }, t(language, 'p')),
                "   : ",
                t(language, 'pause'))) : (React.createElement(Text, { dimColor: true, wrap: "truncate" },
                React.createElement(Text, { color: "yellow" }, t(language, 'p')),
                "   : ",
                t(language, 'pause'))),
            shouldBlink && showBlink ? (React.createElement(Text, { bold: true, color: "yellow", backgroundColor: "red", wrap: "truncate" },
                React.createElement(Text, { color: "yellow" }, t(language, 'r')),
                "   : ",
                t(language, 'restart'))) : (React.createElement(Text, { dimColor: true, wrap: "truncate" },
                React.createElement(Text, { color: "yellow" }, t(language, 'r')),
                "   : ",
                t(language, 'restart'))),
            React.createElement(Text, { dimColor: true, wrap: "truncate" },
                React.createElement(Text, { color: "yellow" }, t(language, 'q')),
                "   : ",
                t(language, 'quit')),
            React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, { dimColor: true, wrap: "truncate" },
                    React.createElement(Text, { color: "green" }, t(language, 'l')),
                    "   : ",
                    t(language, 'language'))),
            Array.from({ length: paddingNeeded }).map((_, i) => (React.createElement(Box, { key: `padding-${i}` },
                React.createElement(Text, null, " ")))))));
};
