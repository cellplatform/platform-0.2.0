import { t, rx } from '../common';
import { Caret } from './Caret.mjs';

/**
 * Manages a set of carets for an editor.
 */
export function EditorCarets(
  monaco: t.Monaco,
  editor: t.MonacoCodeEditor,
  options: { dispose$?: t.Observable<any> } = {},
) {
  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  editor.onDidDispose(dispose);
  dispose$.subscribe(() => api.clear());
  const carets = new Map<string, t.EditorCaret>();

  const api: t.EditorCarets = {
    dispose,
    dispose$,
    editor,

    get current() {
      return Array.from(carets.values());
    },

    id(id: string): t.EditorCaret {
      if (carets.has(id)) return carets.get(id)!;
      const caret = Caret(monaco, editor, id);
      carets.set(id, caret);
      caret.dispose$.subscribe(() => carets.delete(id));
      return caret;
    },

    clear() {
      api.current.forEach((caret) => caret.dispose());
      return api;
    },
  };

  return api;
}
