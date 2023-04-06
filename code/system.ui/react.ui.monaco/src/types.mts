import type { t } from './common.t';

export * from './ui/MonacoEditor/types.mjs';
export * from './ui.logic/EditorCarets/types.mjs';
export * from './ui.logic/MonacoCrdt/types.mjs';

/**
 * Supported languages.
 */
export type EditorLanguage = 'markdown' | 'typescript' | 'javascript' | 'json' | 'yaml';
export type SelectionOffset = { start: number; end: number };

export type EditorRange = {
  readonly startLineNumber: number;
  readonly startColumn: number;
  readonly endLineNumber: number;
  readonly endColumn: number;
};

export type CharPosition = { line: number; column: number };
export type CharPositionTuple = [number, number]; // Line:Column.
export type CharRangeTuple = [number, number, number, number]; // Start:[Line:Column], End:[Line:Column]
