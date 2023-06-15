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

const NULL_RANGE: t.EditorRange = {
  startLineNumber: -1,
  startColumn: -1,
  endLineNumber: -1,
  endColumn: -1,
};

export const DEFAULTS = {
  tabSize: 2,
  language: LANGUAGES[2],
  className: CSS.CLASS.EDITOR,
  NULL_RANGE,
} as const;
