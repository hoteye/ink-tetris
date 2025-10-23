import React, { useContext } from 'react';
import { Box, Text } from 'ink';
import { I18nContext } from '../i18n/I18nContext.js';
import { t } from '../i18n/languages.js';

export const ScoringModal: React.FC = () => {
  const { language } = useContext(I18nContext);

  return (
    <Box
      borderStyle="round"
      borderColor="cyan"
      padding={1}
      width={40}
      flexDirection="column"
      marginTop={1}
    >
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {t(language, 'scoringTitle')}
        </Text>
      </Box>

      <Box flexDirection="column">
        <Text>{t(language, 'scoringInfo')}</Text>
        <Text>{t(language, 'scoringInfo2')}</Text>
        <Text>{t(language, 'scoringInfo3')}</Text>
        <Text>{t(language, 'scoringInfo4')}</Text>

        <Box marginTop={1}>
          <Text>{t(language, 'levelUpInfo')}</Text>
        </Box>

        <Text>{t(language, 'maxLevelInfo')}</Text>

        <Box marginTop={1}>
          <Text dimColor color="gray">
            {t(language, 'pressToClose')}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
