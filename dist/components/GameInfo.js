import React from 'react';
import { Box, Text } from 'ink';
export const GameInfo = ({ score, lines, level, isPaused, isGameOver, }) => {
    return (React.createElement(Box, { flexDirection: "column" },
        React.createElement(Box, { marginBottom: 1, flexDirection: "column" },
            React.createElement(Text, { bold: true, color: "yellow" }, "SCORE"),
            React.createElement(Text, { color: "white" }, score.toString().padStart(6, '0'))),
        React.createElement(Box, { marginBottom: 1, flexDirection: "column" },
            React.createElement(Text, { bold: true, color: "green" }, "LINES"),
            React.createElement(Text, { color: "white" }, lines)),
        React.createElement(Box, { marginBottom: 1, flexDirection: "column" },
            React.createElement(Text, { bold: true, color: "magenta" }, "LEVEL"),
            React.createElement(Text, { color: "white" }, level)),
        isPaused && (React.createElement(Box, { marginTop: 1, borderStyle: "round", borderColor: "yellow", padding: 1 },
            React.createElement(Text, { bold: true, color: "yellow" }, "PAUSED")))));
};
