import { DEFAULTS } from './constants';
import type * as t from './t';

/**
 * Helpers that examine an editor.
 */
export const Editor = {
  content(editor: t.MonacoCodeEditor): t.EditorContent {
    const text = editor.getValue() || '';
    return { text };
  },

  selections(editor: t.MonacoCodeEditor): t.EditorSelection[] {
    return editor.getSelections() ?? [];
  },

  className(editor?: t.MonacoCodeEditor) {
    let id = editor?.getId() ?? '';
    if (id.includes(':')) id = `instance-${id.split(':')[1]}`;
    return `${DEFAULTS.className} ${id}`.trim();
  },
} as const;
