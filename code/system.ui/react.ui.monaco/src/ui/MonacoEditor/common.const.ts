import type { t } from '../../common.t';

export const LANGUAGES: t.EditorLanguage[] = [
  'typescript',
  'javascript',
  'markdown',
  'json',
  'yaml',
];

export const DEFAULTS = {
  tabSize: 2,
  language: LANGUAGES[2],
} as const;
