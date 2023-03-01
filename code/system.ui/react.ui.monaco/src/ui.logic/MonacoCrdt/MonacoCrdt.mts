import { Crdt, t, Automerge } from './common';

/**
 * An adapter for managing 2-way binding between a Monaco code-editor
 * and a CRDT (Automerge.Text) collaborative text data-structure.
 */
export const MonacoCrdt = {
  /**
   * Initialize a new binding.
   */
  init(editor: t.MonacoCodeEditor) {
    /**
     * TODO 🐷
     */
    //     const doc = Crdt.Doc.ref<Doc>({ code: new Automerge.Text() });
    //     let _ignoreChange = false;
    //
    //     doc.$.pipe().subscribe((e) => {
    //       let text = e.doc.code.toString();
    //       const eq = text === editor.getValue();
    //
    //       if (text === 'replace') {
    //         _ignoreChange = true;
    //         const range = editor.getSelection()!;
    //         text = 'hello world!';
    //
    //         editor.setValue(text);
    //         editor.setSelection(range);
    //         _ignoreChange = false;
    //       }
    //     });
    //
    //     editor.onDidChangeModelContent((e) => {
    //       if (_ignoreChange) return;
    //       e.changes.forEach((change) => {
    //         doc.change((d) => {
    //           const text = d.code;
    //           const index = change.rangeOffset;
    //           if (change.text === '') {
    //             text.deleteAt(index, change.rangeLength);
    //           } else {
    //             text.insertAt(index, change.text);
    //           }
    //         });
    //       });
    //     });
  },
};
