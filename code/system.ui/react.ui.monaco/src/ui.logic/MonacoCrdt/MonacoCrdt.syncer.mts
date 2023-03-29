import { Crdt, rx, t } from './common';

type Milliseconds = number;

/**
 * An adapter for managing 2-way binding between a Monaco code-editor
 * and a CRDT (Automerge.Text) collaborative text data-structure.
 */
export function syncer<D extends {}>(
  editor: t.MonacoCodeEditor,
  doc: t.CrdtDocRef<D>,
  field: (doc: D) => t.AutomergeText,
  options: { debounce?: Milliseconds } = {},
) {
  if (!editor) throw new Error(`No editor provided`);
  if (!doc) throw new Error(`No CRDT document provided`);

  let _ignoreChange = false;
  let _isDisposed = false;
  const { dispose, dispose$ } = rx.disposable();
  dispose$.subscribe(() => (_isDisposed = true));

  const getText = (doc: D) => {
    const text = field(doc);
    if (!Crdt.Is.text(text)) throw new Error(`Automerge.Text field not returned from getter`);
    return text;
  };

  /**
   * Document CRDT change.
   */
  doc.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => e.action === 'replace'),
    rx.debounceTime(options.debounce ?? 300),
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
   * Local editor change.
   */
  editor.onDidChangeModelContent((e) => {
    if (api.isDisposed) return;
    if (_ignoreChange) return;

    e.changes.forEach((change) => {
      doc.change((d) => {
        const text = getText(d);
        if (!text) return;

        const index = change.rangeOffset;
        if (change.text === '') {
          text.deleteAt(index, change.rangeLength);
        } else {
          text.insertAt(index, change.text);
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
    get isDisposed() {
      return _isDisposed;
    },
  };

  return api;
}
