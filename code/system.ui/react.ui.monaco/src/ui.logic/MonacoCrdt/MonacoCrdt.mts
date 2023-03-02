import { Crdt, t, Automerge, rx } from './common';

/**
 * An adapter for managing 2-way binding between a Monaco code-editor
 * and a CRDT (Automerge.Text) collaborative text data-structure.
 */
export const MonacoCrdt = {
  /**
   * Initialize a new binding.
   */
  init<D extends {}>(doc: t.CrdtDocRef<D>, codeField: keyof D, editor: t.MonacoCodeEditor) {
    let _isDisposed = false;
    const { dispose, dispose$ } = rx.disposable();
    dispose$.subscribe(() => (_isDisposed = true));

    const toTextType = <D extends {}>(doc: D, codeField: keyof D) => {
      const text = doc[codeField];
      return text instanceof Automerge.Text ? text : undefined;
    };

    let _ignoreChange = false;
    doc.$.pipe().subscribe((e) => {
      const textCrdt = toTextType(doc.current, codeField);
      if (!textCrdt) return;

      let text = textCrdt.toString();
      const eq = text === editor.getValue();

      if (!eq) {
        _ignoreChange = true;
        const range = editor.getSelection()!;

        editor.setValue(text);
        editor.setSelection(range);
        _ignoreChange = false;
      }
    });

    editor.onDidChangeModelContent((e) => {
      if (_ignoreChange) return;
      e.changes.forEach((change) => {
        doc.change((d) => {
          const textCrdt = toTextType<D>(d, codeField);
          if (textCrdt) {
            const index = change.rangeOffset;
            if (change.text === '') {
              textCrdt.deleteAt(index, change.rangeLength);
            } else {
              textCrdt.insertAt(index, change.text);
            }
          }
        });
      });
    });

    /**
     * API
     */
    return {
      kind: 'MonacoCRDT',
      dispose,
      dispose$,
      get isDisposed() {
        return _isDisposed;
      },
    };
  },
};
