import { createContext } from 'react';
import { Language } from './languages.js';

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
});
