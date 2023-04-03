export * from './ui/MonacoEditor/types.mjs';
export * from './ui/MonacoEditor.hooks/types.mjs';
export * from './ui.logic/MonacoCrdt/types.mjs';

/**
 * Supported languages.
 */
export type EditorLanguage = 'markdown' | 'typescript' | 'javascript' | 'json' | 'yaml';
export type SelectionOffset = { start: number; end: number };
