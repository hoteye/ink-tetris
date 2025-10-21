import React, { useState, useEffect, useContext } from 'react';
import { Box, Text } from 'ink';
import { I18nContext } from '../i18n/I18nContext.js';
import { t } from '../i18n/languages.js';
export const Controls = ({ shouldBlink = false }) => {
    const { language } = useContext(I18nContext);
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
            React.createElement(Text, { bold: true, color: "cyan" }, t(language, 'controls'))),
        React.createElement(Box, { flexDirection: "column" },
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, t(language, 'leftRight')),
                " : ",
                t(language, 'move')),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, t(language, 'up')),
                " : ",
                t(language, 'rotate')),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, t(language, 'down')),
                " : ",
                t(language, 'softDrop')),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, t(language, 'space')),
                " : ",
                t(language, 'hardDrop')),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, t(language, 'p')),
                "   : ",
                t(language, 'pause')),
            shouldBlink && showBlink ? (React.createElement(Text, { bold: true, color: "yellow", backgroundColor: "red" },
                React.createElement(Text, { color: "yellow" }, t(language, 'r')),
                "   : ",
                t(language, 'restart'))) : (React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, t(language, 'r')),
                "   : ",
                t(language, 'restart'))),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "yellow" }, t(language, 'q')),
                "   : ",
                t(language, 'quit')),
            React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, { dimColor: true },
                    React.createElement(Text, { color: "green" }, t(language, 'l')),
                    "   : ",
                    t(language, 'language'))))));
};
