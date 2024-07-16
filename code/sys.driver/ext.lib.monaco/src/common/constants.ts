import type * as t from './t';

export { COLORS } from 'sys.ui.react.common';

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
  NULL_RANGE,
  tabSize: 2,
  language: LANGUAGES[0],
  className: CSS.CLASS.EDITOR,
  readOnly: false,
  minimap: true,
} as const;
