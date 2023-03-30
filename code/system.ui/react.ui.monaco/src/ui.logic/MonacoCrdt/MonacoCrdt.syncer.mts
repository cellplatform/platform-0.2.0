import { Position, Range } from 'monaco-editor';
import { Crdt, rx, t } from './common';

import type { ISelection } from 'monaco-editor';

type Milliseconds = number;
type SelectionOffset = { start: number; end: number };

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
   * Keep track of current/previous selection offsets.
   */
  let _selection: SelectionOffset = { start: 0, end: 0 };
  editor.onDidChangeCursorSelection((e) => (_selection = Wrangle.offsets(editor, e.selection)));

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
    const oldLength = e.changes.reduce((acc, c) => acc + c.rangeLength, 0);
    const newLength = e.changes.reduce((acc, c) => acc + c.text.length, 0);
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

/**
 * Helpers
 */

const Wrangle = {
  offsets(editor: t.MonacoCodeEditor, selection: ISelection) {
    const model = editor.getModel();
    if (!model) throw new Error(`Editor did not return a text model.`);
    const position = {
      start: new Position(selection.selectionStartLineNumber, selection.selectionStartColumn),
      end: new Position(selection.positionLineNumber, selection.positionColumn),
    };
    const range = Range.fromPositions(position.start, position.end);
    return {
      start: model.getOffsetAt(range.getStartPosition()),
      end: model.getOffsetAt(range.getEndPosition()),
    };
  },
};
