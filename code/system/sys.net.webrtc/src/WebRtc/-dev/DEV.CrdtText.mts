import { Crdt, type t, Automerge } from '../../test.ui';

import type { Doc } from './DEV.CrdtSync';

/**
 *
 */
export const DevCrdtTextSample = {
  init(args: { editor: t.MonacoCodeEditor; doc: t.CrdtDocRef<Doc> }) {
    const { editor, doc } = args;

    if (!(doc.current.code instanceof Automerge.Text)) {
      doc.change((d) => (d.code = new Automerge.Text())); // TEMP 🐷 schema update.
    }

    let _ignoreChange = false;
    const updateEditorText = (text: string) => {
      _ignoreChange = true;
      const selectionBefore = editor.getSelection();
      editor.setValue(text);
      if (selectionBefore) editor.setSelection(selectionBefore);
      _ignoreChange = false;
    };

    updateEditorText(doc.current.code.toString());

    doc.$.pipe().subscribe((e) => {
      const text = e.doc.code.toString();
      console.log('change$', text);
      const eq = text === editor.getValue();
      if (!eq) updateEditorText(text);
    });

    editor.onDidChangeModelContent((e) => {
      if (_ignoreChange) return;
      e.changes.forEach((change) => {
        doc.change((d) => {
          const text = d.code;
          const index = change.rangeOffset;
          if (change.text === '') {
            text.deleteAt(index, change.rangeLength);
          } else {
            text.insertAt(index, change.text);
          }
          console.log('editor:', text.toString());
        });
      });
    });
  },
};
