import { type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  lowercaseTheme(theme: t.CommonTheme = 'Light') {
    return theme === 'Light' ? 'light' : 'dark';
  },
} as const;
