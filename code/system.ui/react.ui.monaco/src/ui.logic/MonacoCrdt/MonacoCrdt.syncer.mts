import { Crdt, rx, t } from './common';
import { SelectionOffset, Wrangle } from './Wrangle.mjs';

type Milliseconds = number;

/**
 * An adapter for managing 2-way binding between a Monaco code-editor
 * and a CRDT (Automerge.Text) collaborative text data-structure.
 */
export function syncer<D extends {}>(args: {
  editor: t.MonacoCodeEditor;
  doc: t.CrdtDocRef<D>;
  text: (doc: D) => t.AutomergeText;
  debounce?: Milliseconds;
}) {
  const { editor, doc, debounce = 300 } = args;
  if (!editor) throw new Error(`No editor provided`);
  if (!doc) throw new Error(`No CRDT document provided`);

  let _ignoreChange = false;
  let _isDisposed = false;
  const { dispose, dispose$ } = rx.disposable();
  dispose$.subscribe(() => (_isDisposed = true));

  const getText = (doc: D) => {
    const text = args.text(doc);
    if (!Crdt.Is.text(text)) throw new Error(`Automerge.Text field not returned from getter`);
    return text;
  };

  const changeText = (fn: (text: t.AutomergeText) => void) => {
    doc.change((d) => {
      const text = getText(d);
      if (text) fn(text);
    });
  };

  /**
   * Document CRDT change.
   */
  doc.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => e.action === 'replace'),
    rx.debounceTime(debounce),
  ).subscribe((e) => {
    const text = getText(doc.current);
    if (!text) return;

    let value = text.toString();
    const eq = value === editor.getValue();

    if (!eq) {
      _ignoreChange = true;
      const before = editor.getSelection()!;
      editor.setValue(value);
      editor.setSelection(before);
      _ignoreChange = false;
    }
  });

  /**
   * Keep track of current/previous selection offsets.
   */
  let _selection: SelectionOffset = { start: 0, end: 0 };
  editor.onDidChangeCursorSelection((e) => {
    _selection = Wrangle.offsets(editor, e.selection);
  });

  /**
   * Local editor change.
   */
  editor.onDidChangeModelContent((e) => {
    if (api.disposed) return;
    if (_ignoreChange) return;

    /**
     * Check if the user has deleted all text by replacing
     * a complete selection with a single typed character.
     */
    const oldLength = e.changes.reduce((acc, change) => acc + change.rangeLength, 0);
    const newLength = e.changes.reduce((acc, change) => acc + change.text.length, 0);
    if (oldLength > 0 && newLength > 0) {
      changeText((text) => {
        const offset = _selection;
        text.deleteAt(offset.start, offset.end - offset.start);
      });
    }

    /**
     * Apply each change to the CRDT text field.
     */
    e.changes.forEach((change) => {
      changeText((text) => {
        const index = change.rangeOffset;
        if (change.text === '') {
          text.deleteAt(index, change.rangeLength);
        } else {
          text.insertAt(index, ...change.text.split(''));
        }
      });
    });
  });

  /**
   * API
   */
  const api: t.MonacoCrdtSyncer<D> = {
    kind: 'crdt:monaco:syncer',
    editor,
    doc,

    dispose,
    dispose$,
    get disposed() {
      return _isDisposed;
    },
  };

  return api;
}
