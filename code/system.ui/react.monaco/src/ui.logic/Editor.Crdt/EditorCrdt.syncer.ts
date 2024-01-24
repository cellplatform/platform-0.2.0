import { DEFAULTS, rx, type t } from './common';

/**
 * An adapter for managing 2-way binding between a code-editor UI
 * component and a CRDT (Automerge.Text) data-structure.
 */
export function syncer(args: {
  monaco: t.Monaco;
  editor: t.MonacoCodeEditor;
  state: t.Lens<t.CodeDoc>;
  debounce?: t.Msecs;
  dispose$?: t.UntilObservable;
}) {
  const { monaco, editor, state, debounce = DEFAULTS.debounce } = args;

  const life = rx.lifecycle();
  const { dispose, dispose$ } = life;
  dispose$.subscribe(() => {
    handlerDidChangeModelContent.dispose();
  });

  let _ignoreChange = false;

  /**
   * CRDT changed.
   */
  const events = state.events(dispose$);
  events.changed$.subscribe((e) => {
    console.log('lens changed', e);
  });

  /**
   * Local editor changed.
   */
  const handlerDidChangeModelContent = editor.onDidChangeModelContent((e) => {
    if (life.disposed || _ignoreChange) return;

    /**
     * Check if the user has deleted text by replacing
     * a complete selection with a single typed character.
     *
     * Ensure the CRDT selected text is deleted before adding the
     * changed character data.
     */
    const oldLength = e.changes.reduce((acc, change) => acc + change.rangeLength, 0);
    const newLength = e.changes.reduce((acc, change) => acc + change.text.length, 0);
    if (oldLength > 0 && newLength > 0) {
      // docText.change((text) => {
      //   _lastSelection.forEach(({ start, end }) => {
      //     text.deleteAt(start, end - start);
      //   });
      // });
    }

    /**
     * Apply each change to the CRDT text field.
     */
    e.changes.forEach((change) => {
      console.log('state.toObject()', state.toObject());
      state.change((d) => {
        //
        // const text = d.code || (d.code = new A.Text(''));

        const index = change.rangeOffset;
        if (change.text === '') {
          // text.deleteAt(index, change.rangeLength);
        } else {
          // text.insertAt(index, ...change.text.split(''));
        }
      });
    });

    console.log('e', e);
    console.log('oldLength', oldLength);
    console.log('newLength', newLength);
  });

  const api = {
    /**
     * Lifecycle
     */
    dispose,
    dispose$,
    get disposed() {
      return life.disposed;
    },
  } as const;
  return api;
}
