import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
export const Controls = ({ shouldBlink = false }) => {
    const [showBlink, setShowBlink] = useState(true);
    useEffect(() => {
        if (!shouldBlink) {
            setShowBlink(true);
            return;
        }
        const interval = setInterval(() => {
            setShowBlink((prev) => !prev);
        }, 500); // 每 500ms 切换一次
        return () => clearInterval(interval);
    }, [shouldBlink]);
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "round", borderColor: "blue", padding: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { bold: true, color: "cyan" }, "CONTROLS")),
        React.createElement(Box, { flexDirection: "column" },
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, "\u2190/\u2192"),
                " : Move"),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, "\u2191"),
                "   : Rotate"),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, "\u2193"),
                "   : Soft Drop"),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, "Space"),
                " : Hard Drop"),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, "P"),
                "   : Pause"),
            shouldBlink && showBlink ? (React.createElement(Text, { bold: true, color: "yellow", backgroundColor: "red" },
                React.createElement(Text, { color: "yellow" }, "R"),
                "   : Restart/Start")) : (React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, "R"),
                "   : Restart/Start")),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, "Q"),
                "   : Quit"))));
};
