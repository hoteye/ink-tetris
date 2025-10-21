import React, { useContext } from 'react';
import { Box, Text } from 'ink';
import { I18nContext } from '../i18n/I18nContext.js';
import { t } from '../i18n/languages.js';

interface GameInfoProps {
  score: number;
  lines: number;
  level: number;
  isPaused: boolean;
  isGameOver: boolean;
}

export const GameInfo: React.FC<GameInfoProps> = ({
  score,
  lines,
  level,
  isPaused,
  isGameOver,
}) => {
  const { language } = useContext(I18nContext);
  return (
    <Box flexDirection="column">
      <Box marginBottom={1} flexDirection="column">
        <Text bold color="yellow">
          {t(language, 'score')}
        </Text>
        <Text color="white">{score.toString().padStart(6, '0')}</Text>
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Text bold color="green">
          {t(language, 'lines')}
        </Text>
        <Text color="white">{lines}</Text>
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Text bold color="magenta">
          {t(language, 'level')}
        </Text>
        <Text color="white">{level}</Text>
      </Box>

      {isPaused && (
        <Box marginTop={1} borderStyle="round" borderColor="yellow" padding={1}>
          <Text bold color="yellow">
            {t(language, 'paused')}
          </Text>
        </Box>
      )}
    </Box>
  );
};
