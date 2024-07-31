import { rx, type t } from '../common';
import { CaretDecoration } from './Decoration';

/**
 * Manages a set of carets for an editor.
 */
export function EditorCarets(
  editor: t.MonacoCodeEditor,
  options: { dispose$?: t.Observable<any> } = {},
): t.EditorCarets {
  let _isDisposed = false;
  const { dispose, dispose$ } = rx.disposable(options.dispose$);
  const handlerDidDispose = editor.onDidDispose(dispose);
  dispose$.subscribe(() => {
    _isDisposed = true;
    handlerDidDispose.dispose();
    api.clear();
    $.complete();
  });

  const $ = new rx.Subject<t.EditorCaretChanged>();
  const carets = new Map<string, t.EditorCaret>();

  const api: t.EditorCarets = {
    $: $.pipe(rx.takeUntil(dispose$)),
    editor,

    get current() {
      return Array.from(carets.values());
    },

    id(id: string): t.EditorCaret {
      if (carets.has(id)) return carets.get(id)!;
      const caret = CaretDecoration(editor, id);
      carets.set(id, caret);
      caret.$.subscribe((e) => $.next(e));
      caret.dispose$.subscribe(() => carets.delete(id));
      return caret;
    },

    clear() {
      api.current.forEach((caret) => caret.dispose());
      return api;
    },

    /**
     * Lifecycle.
     */
    dispose,
    dispose$,
    get disposed() {
      return _isDisposed;
    },
  };

  return api;
}
