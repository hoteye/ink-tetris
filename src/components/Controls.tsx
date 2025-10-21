import React, { useState, useEffect, useContext } from 'react';
import { Box, Text } from 'ink';
import { I18nContext } from '../i18n/I18nContext.js';
import { t } from '../i18n/languages.js';

interface ControlsProps {
  shouldBlink?: boolean; // 是否需要闪烁 R 键提示
}

export const Controls: React.FC<ControlsProps> = ({ shouldBlink = false }) => {
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

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {t(language, 'controls')}
        </Text>
      </Box>
      <Box flexDirection="column">
        <Text dimColor>
          <Text color="yellow">{t(language, 'leftRight')}</Text> : {t(language, 'move')}
        </Text>
        <Text dimColor>
          <Text color="yellow">{t(language, 'up')}</Text> : {t(language, 'rotate')}
        </Text>
        <Text dimColor>
          <Text color="yellow">{t(language, 'down')}</Text> : {t(language, 'softDrop')}
        </Text>
        <Text dimColor>
          <Text color="yellow">{t(language, 'space')}</Text> : {t(language, 'hardDrop')}
        </Text>
        <Text dimColor>
          <Text color="yellow">{t(language, 'p')}</Text>   : {t(language, 'pause')}
        </Text>
        {shouldBlink && showBlink ? (
          <Text bold color="yellow" backgroundColor="red">
            <Text color="yellow">{t(language, 'r')}</Text>   : {t(language, 'restart')}
          </Text>
        ) : (
          <Text dimColor>
            <Text color="yellow">{t(language, 'r')}</Text>   : {t(language, 'restart')}
          </Text>
        )}
        <Text dimColor>
          <Text color="yellow">{t(language, 'q')}</Text>   : {t(language, 'quit')}
        </Text>
        <Box marginTop={1}>
          <Text dimColor>
            <Text color="green">{t(language, 'l')}</Text>   : {t(language, 'language')}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
