import { Crdt, rx, t } from './common';
import { SelectionOffset, Wrangle } from './Wrangle.mjs';

type PeerId = string;
type Milliseconds = number;

/**
 * An adapter for managing 2-way binding between a Monaco code-editor
 * and a CRDT (Automerge.Text) collaborative text data-structure.
 */
export function syncer<D extends {}, P extends {} = D>(args: {
  editor: t.MonacoCodeEditor;
  data: {
    doc: t.CrdtDocRef<D>;
    getText: (doc: D) => t.AutomergeText;
  };
  peers?: {
    local: PeerId;
    doc: t.CrdtDocRef<P>;
    getPeers: (doc: P) => t.EditorPeersState;
  };
  debounce?: Milliseconds;
}): t.MonacoCrdtSyncer {
  const { peers, editor, data, debounce = 300 } = args;

  if (!editor) throw new Error(`No editor provided`);
  if (!data.doc) throw new Error(`No CRDT document provided`);

  let _ignoreChange = false;
  let _isDisposed = false;
  const { dispose, dispose$ } = rx.disposable();
  dispose$.subscribe(() => (_isDisposed = true));

  const Text = {
    get(doc: D) {
      const text = data.getText(doc);
      if (!Crdt.Is.text(text)) throw new Error(`[Automerge.Text] not returned from getter`);
      return text;
    },
    change(fn: (text: t.AutomergeText) => void) {
      data.doc.change((d) => {
        const text = Text.get(d);
        if (text) fn(text);
      });
    },
  };

  const Peers = {
    get(doc: P) {
      return peers?.getPeers(doc);
    },
    change(fn: (peers: t.EditorPeersState) => void) {
      if (!peers) throw new Error(`Ensure a {peers} argument is provided`);
      peers.doc.change((d) => {
        const peers = Peers.get(d);
        if (typeof peers !== 'object') {
          throw new Error(`[EditorPeersState] not returned from getter`);
        }
        fn(peers);
      });
    },
    changeLocal(fn: (local: t.EditorPeerState) => void) {
      if (!peers) throw new Error(`Ensure a {peers} argument is provided`);
      Peers.change((obj) => {
        if (!obj[peers.local]) obj[peers.local] = {};
        fn(obj[peers.local]);
      });
    },
  };

  /**
   * Document CRDT change.
   */
  data.doc.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => e.action === 'replace'),
    rx.debounceTime(debounce),
  ).subscribe((e) => {
    const text = Text.get(data.doc.current);
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
    _selection = Wrangle.offsets(editor, e.selection);

    // Update synced peer selection state.
    if (peers) {
      Peers.changeLocal((local) => (local.selection = { ...e.selection }));
    }
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
      Text.change((text) => {
        const offset = _selection;
        text.deleteAt(offset.start, offset.end - offset.start);
      });
    }

    /**
     * Apply each change to the CRDT text field.
     */
    e.changes.forEach((change) => {
      Text.change((text) => {
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
