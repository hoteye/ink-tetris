import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

interface ControlsProps {
  shouldBlink?: boolean; // 是否需要闪烁 R 键提示
}

export const Controls: React.FC<ControlsProps> = ({ shouldBlink = false }) => {
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

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          CONTROLS
        </Text>
      </Box>
      <Box flexDirection="column">
        <Text dimColor>
          <Text color="yellow">←/→</Text> : Move
        </Text>
        <Text dimColor>
          <Text color="yellow">↑</Text>   : Rotate
        </Text>
        <Text dimColor>
          <Text color="yellow">↓</Text>   : Soft Drop
        </Text>
        <Text dimColor>
          <Text color="yellow">Space</Text> : Hard Drop
        </Text>
        <Text dimColor>
          <Text color="yellow">P</Text>   : Pause
        </Text>
        {shouldBlink && showBlink ? (
          <Text bold color="yellow" backgroundColor="red">
            <Text color="yellow">R</Text>   : Restart/Start
          </Text>
        ) : (
          <Text dimColor>
            <Text color="yellow">R</Text>   : Restart/Start
          </Text>
        )}
        <Text dimColor>
          <Text color="yellow">Q</Text>   : Quit
        </Text>
      </Box>
    </Box>
  );
};
