import React, { useContext } from 'react';
import { Box, Text } from 'ink';
import { I18nContext } from '../i18n/I18nContext.js';
import { t } from '../i18n/languages.js';
export const GameInfo = ({ score, lines, level, isPaused, }) => {
    const { language } = useContext(I18nContext);
    return (React.createElement(Box, { flexDirection: "column" },
        React.createElement(Box, { marginBottom: 1, flexDirection: "column" },
            React.createElement(Text, { bold: true, color: "yellow" }, t(language, 'score')),
            React.createElement(Text, { color: "white" }, score.toString().padStart(6, '0'))),
        React.createElement(Box, { marginBottom: 1, flexDirection: "column" },
            React.createElement(Text, { bold: true, color: "green" }, t(language, 'lines')),
            React.createElement(Text, { color: "white" }, lines)),
        React.createElement(Box, { marginBottom: 1, flexDirection: "column" },
            React.createElement(Text, { bold: true, color: "magenta" }, t(language, 'level')),
            React.createElement(Text, { color: "white" }, level))));
};
