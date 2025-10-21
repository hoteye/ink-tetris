import React from 'react';
import { Box, Text } from 'ink';

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
  return (
    <Box flexDirection="column">
      <Box marginBottom={1} flexDirection="column">
        <Text bold color="yellow">
          SCORE
        </Text>
        <Text color="white">{score.toString().padStart(6, '0')}</Text>
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Text bold color="green">
          LINES
        </Text>
        <Text color="white">{lines}</Text>
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Text bold color="magenta">
          LEVEL
        </Text>
        <Text color="white">{level}</Text>
      </Box>

      {isPaused && (
        <Box marginTop={1} borderStyle="round" borderColor="yellow" padding={1}>
          <Text bold color="yellow">
            PAUSED
          </Text>
        </Box>
      )}
    </Box>
  );
};
