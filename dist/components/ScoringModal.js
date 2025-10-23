import React, { useContext } from 'react';
import { Box, Text } from 'ink';
import { I18nContext } from '../i18n/I18nContext.js';
import { t } from '../i18n/languages.js';
export const ScoringModal = () => {
    const { language } = useContext(I18nContext);
    return (React.createElement(Box, { borderStyle: "round", borderColor: "cyan", padding: 1, width: 40, flexDirection: "column", marginTop: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { bold: true, color: "cyan" }, t(language, 'scoringTitle'))),
        React.createElement(Box, { flexDirection: "column" },
            React.createElement(Text, null, t(language, 'scoringInfo')),
            React.createElement(Text, null, t(language, 'scoringInfo2')),
            React.createElement(Text, null, t(language, 'scoringInfo3')),
            React.createElement(Text, null, t(language, 'scoringInfo4')),
            React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, null, t(language, 'levelUpInfo'))),
            React.createElement(Text, null, t(language, 'maxLevelInfo')),
            React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, { dimColor: true, color: "gray" }, "Press I to close")))));
};
