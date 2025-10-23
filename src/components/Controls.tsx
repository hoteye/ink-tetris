import React, { useState, useEffect, useContext } from 'react';
import { Box, Text } from 'ink';
import { I18nContext } from '../i18n/I18nContext.js';
import { t } from '../i18n/languages.js';
import { VISIBLE_ROWS } from '../core/constants.js';

interface ControlsProps {
  shouldBlink?: boolean; // 是否需要闪烁 R 键提示
  isPaused?: boolean; // 是否暂停（闪烁 P 键）
}

export const Controls: React.FC<ControlsProps> = ({ shouldBlink = false, isPaused = false }) => {
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

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1} width={22} height={GAMEBOARD_HEIGHT}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {t(language, 'controls')}
        </Text>
      </Box>
      <Box flexDirection="column">
        <Text dimColor wrap="truncate">
          <Text color="yellow">{t(language, 'leftRight')}</Text> : {t(language, 'move')}
        </Text>
        <Text dimColor wrap="truncate">
          <Text color="yellow">{t(language, 'up')}</Text> : {t(language, 'rotate')}
        </Text>
        <Text dimColor wrap="truncate">
          <Text color="yellow">{t(language, 'down')}</Text> : {t(language, 'softDrop')}
        </Text>
        <Text dimColor wrap="truncate">
          <Text color="yellow">{t(language, 'space')}</Text> : {t(language, 'hardDrop')}
        </Text>
        {isPaused && showBlink ? (
          <Text bold color="yellow" backgroundColor="red" wrap="truncate">
            <Text color="yellow">{t(language, 'p')}</Text>   : {t(language, 'pause')}
          </Text>
        ) : (
          <Text dimColor wrap="truncate">
            <Text color="yellow">{t(language, 'p')}</Text>   : {t(language, 'pause')}
          </Text>
        )}
        {shouldBlink && showBlink ? (
          <Text bold color="yellow" backgroundColor="red" wrap="truncate">
            <Text color="yellow">{t(language, 'r')}</Text>   : {t(language, 'restart')}
          </Text>
        ) : (
          <Text dimColor wrap="truncate">
            <Text color="yellow">{t(language, 'r')}</Text>   : {t(language, 'restart')}
          </Text>
        )}
        <Text dimColor wrap="truncate">
          <Text color="yellow">{t(language, 'q')}</Text>   : {t(language, 'quit')}
        </Text>
        <Box marginTop={1}>
          <Text dimColor wrap="truncate">
            <Text color="green">{t(language, 'l')}</Text>   : {t(language, 'language')}
          </Text>
        </Box>

        {/* 填充空行以匹配 GameBoard 高度 */}
        {Array.from({ length: paddingNeeded }).map((_, i) => (
          <Box key={`padding-${i}`}>
            <Text> </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
