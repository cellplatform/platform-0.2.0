import { rx, t } from './common';
import { DocPeers } from './doc.Peers.mjs';
import { DocText } from './doc.Text.mjs';
import { SelectionOffset, Wrangle } from './Wrangle.mjs';

type Milliseconds = number;

/**
 * An adapter for managing 2-way binding between a Monaco code-editor
 * and a CRDT (Automerge.Text) collaborative text data-structure.
 */
export function syncer<D extends {}, P extends {} = D>(args: {
  monaco: t.Monaco;
  editor: t.MonacoCodeEditor;
  data: t.MonacoCrdtSyncerDocTextArg<D>;
  peers?: t.MonacoCrdtSyncerDocPeersArg<P>;
  debounce?: Milliseconds;
  dispose$?: t.Observable<any>;
}): t.MonacoCrdtSyncer {
  const { monaco, editor, data, debounce = 300 } = args;

  if (!editor) throw new Error(`No editor provided`);
  if (!data.doc) throw new Error(`No CRDT document provided`);

  let _ignoreChange = false;
  let _isDisposed = false;
  const { dispose, dispose$ } = rx.disposable(args.dispose$);
  dispose$.subscribe(() => (_isDisposed = true));

  const docText = DocText(args.data);
  const docPeers = DocPeers(args.peers);

  /**
   * Document CRDT change.
   */
  data.doc.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => e.action === 'replace'),
    rx.debounceTime(debounce),
  ).subscribe((e) => {
    const text = docText.get(data.doc.current);
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
    // Store latest cursor selection.
    _selection = Wrangle.offsets(monaco, editor, e.selection);

    // Update shared/synced peer selection state.
    if (docPeers) {
      docPeers.changeLocal((local) => (local.selection = Wrangle.asRange(e.selection)));
    }
  });

  /**
   * Local editor change.
   */
  editor.onDidChangeModelContent((e) => {
    if (api.disposed) return;
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
      docText.change((text) => {
        const offset = _selection;
        text.deleteAt(offset.start, offset.end - offset.start);
      });
    }

    /**
     * Apply each change to the CRDT text field.
     */
    e.changes.forEach((change) => {
      docText.change((text) => {
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
  const api: t.MonacoCrdtSyncer = {
    kind: 'crdt:monaco:syncer',
    dispose,
    dispose$,
    get disposed() {
      return _isDisposed;
    },
  };

  return api;
}
