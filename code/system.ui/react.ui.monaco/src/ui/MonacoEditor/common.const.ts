import type { t } from '../../common.t';
import { CSS } from '../../common/const.mjs';

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
  className: CSS.CLASS.EDITOR,
} as const;
