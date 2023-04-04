import type { t } from '../common.t';

export const COLORS = {
  BLACK: '#000',
  WHITE: '#fff',
  DARK: '#293042', // Inky blue/black.
  CYAN: '#00C2FF',
  MAGENTA: '#FE0064',
  BLUE: '#4D7EF7',
} as const;

export const CSS = {
  CLASS: {
    EDITOR: `sys-monaco-editor`,
  },
} as const;

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
