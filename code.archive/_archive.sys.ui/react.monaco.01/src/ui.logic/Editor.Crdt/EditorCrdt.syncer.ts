import { next as A } from '@automerge/automerge';
import { DEFAULTS, Wrangle, rx, type t } from './common';

/**
 * An adapter for managing 2-way binding between a code-editor UI
 * component and a CRDT (Automerge.Text) data-structure.
 */
export function syncer(args: {
  monaco: t.Monaco;
  editor: t.MonacoCodeEditor;
  lens: t.Lens<t.CodeDoc>;
  debounce?: t.Msecs;
  dispose$?: t.UntilObservable;
}) {
  const { monaco, editor, lens, debounce = DEFAULTS.debounce } = args;

  const life = rx.lifecycle();
  const { dispose, dispose$ } = life;
  dispose$.subscribe(() => {
    handlerDidChangeModelContent.dispose();
    handlerDidChangeCursorSelection.dispose();
  });

  const events = {
    lens: lens.events(dispose$),
  } as const;

  /**
   * Editor change.
   */
  let _ignoreChange = false;
  const changeEditorText = (text: string) => {
    _ignoreChange = true;

    const before = editor.getSelections()!;
    editor.setValue(text);
    editor.setSelections(before);

    _ignoreChange = false;
  };

  /**
   * Keep track of current/previous selection offsets.
   */
  let _lastSelection: t.SelectionOffset[] = [];
  const handlerDidChangeCursorSelection = editor.onDidChangeCursorSelection((e) => {
    if (life.disposed) return;

    const next = editor.getSelections() || [];
    _lastSelection = next.map((range) => Wrangle.monaco(monaco).offsets(editor, range));

    // console.log('_lastSelection', _lastSelection);
    // if (args.peers) {
    //   const selections = next.map((next) => Wrangle.asRange(next));
    //   docPeers.changeLocal((local) => (local.selections = selections));
    // }

    // fireChange('local', 'selection');
  });

  /**
   * CRDT changed.
   */
  events.lens.changed$.pipe().subscribe((e) => {
    const prev = editor.getValue();
    const next = e.after.code ?? '';
    if (prev !== next) changeEditorText(next);
  });

  /**
   * Local editor changed.
   */
  const handlerDidChangeModelContent = editor.onDidChangeModelContent((e) => {
    if (life.disposed) return;
    if (_ignoreChange) return;

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
      console.log('delete replace');
      // console.log("_lastSelection", _lastSelection)

      lens.change((d) => {
        //
        _lastSelection.forEach(({ start, end }) => {
          A.splice(d, ['code'], start, end - start);
          // text.deleteAt(start, end - start);
        });
      });

      // docText.change((text) => {
      //   _lastSelection.forEach(({ start, end }) => {
      //     text.deleteAt(start, end - start);
      //   });
      // });
    }

    /**
     * Apply each change to the CRDT text field.
     * https://automerge.org/automerge/api-docs/js/functions/next.splice.html
     */
    e.changes.forEach((change) => {
      lens.change((d) => {
        const i = change.rangeOffset;
        console.log('change', change);
        if (change.text === '') {
          A.splice(d, ['code'], i, change.rangeLength); // Delete.
        } else {
          A.splice(d, ['code'], i, 0, change.text); // Update.
        }
      });
    });
  });

  /**
   * API
   */
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

  /**
   * Initialize
   */
  const initial = lens.current.code;
  if (initial) {
    changeEditorText(initial);
  }

  return api;
}
