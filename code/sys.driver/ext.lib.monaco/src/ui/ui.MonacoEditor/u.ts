import { type t } from './common';

import { Theme } from './u.Theme';
export { Theme };

/**
 * Helpers
 */
export const Util = {
  Theme,

  toState(editor: t.MonacoCodeEditor): t.EditorState {
    const text = editor.getValue() || '';
    const selections = editor.getSelections() || [];
    return { text, selections };
  },
} as const;
