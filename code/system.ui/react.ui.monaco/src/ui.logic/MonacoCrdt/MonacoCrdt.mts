import { Crdt, rx, t } from './common';

/**
 * Tools for working with CRDTs and Monaco.
 */
export const MonacoCrdt = {
  /**
   * An adapter for managing 2-way binding between a Monaco code-editor
   * and a CRDT (Automerge.Text) collaborative text data-structure.
   */
  syncer<D extends {}>(editor: t.MonacoCodeEditor, doc: t.CrdtDocRef<D>, field: keyof D) {
    if (!editor) throw new Error(`No editor provided`);
    if (!doc) throw new Error(`No CRDT document provided`);

    let _isDisposed = false;
    const { dispose, dispose$ } = rx.disposable();
    dispose$.subscribe(() => (_isDisposed = true));

    let _ignoreChange = false;

    /**
     * Document CRDT change.
     */
    doc.$.pipe(
      rx.takeUntil(dispose$),
      rx.filter((e) => e.action === 'change'),
    ).subscribe((e) => {
      const textCrdt = Crdt.fieldAs(doc.current, field).textType;
      if (!textCrdt) return;

      let text = textCrdt.toString();
      const eq = text === editor.getValue();

      console.log('🐷 SYNC!! doc changed', eq);

      if (!eq) {
        _ignoreChange = true;
        const range = editor.getSelection()!;

        // TODO 🐷
        // editor.setValue(text);
        // editor.setSelection(range);
        _ignoreChange = false;
      }
    });

    /**
     * Local editor change.
     */
    editor.onDidChangeModelContent((e) => {
      if (api.isDisposed) return;
      if (_ignoreChange) return;

      console.log('🐷 SYNC!! editor changed');

      e.changes.forEach((change) => {
        doc.change((d) => {
          const textCrdt = Crdt.fieldAs(d, field).textType;
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
    const api: t.MonacoCrdtSyncer<D> = {
      kind: 'crdt:monaco:syncer',
      editor,
      doc,
      field,

      /**
       * Disposal.
       */
      dispose,
      dispose$,
      get isDisposed() {
        return _isDisposed;
      },
    };

    return api;
  },
};
