import { EditorCarets } from '../EditorCarets';
import { rx, t, Wrangle } from './common';
import { DocPeers } from './doc.Peers.mjs';
import { DocText } from './doc.Text.mjs';

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
  dispose$.subscribe(() => {
    _isDisposed = true;
    _$.complete();
  });

  type C = t.MonacoCrdtSyncerChange;
  const _$ = new rx.Subject<C>();
  const fireChange = (proximity: C['proximity'], kind: C['kind']) => _$.next({ proximity, kind });

  const docText = DocText(args.data);
  const docPeers = DocPeers(args.peers);
  const carets = EditorCarets(monaco, editor, { dispose$ });

  /**
   * Document CRDT change.
   */
  docText.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => e.action === 'replace'),
    rx.debounceTime(debounce),
  ).subscribe((e) => {
    const text = docText.get(data.doc.current)?.toString();
    if (!text) return;

    if (text !== editor.getValue()) {
      _ignoreChange = true;

      const before = editor.getSelection()!;
      editor.setValue(text);
      editor.setSelection(before);

      _ignoreChange = false;
      fireChange('remote', 'text');
    }
  });

  /**
   * Remote peers change (caret/selection).
   */
  docPeers.$?.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => e.action === 'replace'),
    rx.debounceTime(debounce),
  ).subscribe((e) => {
    const local = args.peers?.local ?? '';
    const peers = docPeers.get(e.doc);
    if (local && peers) {
      Object.keys(peers)
        .filter((key) => key !== local)
        .forEach((key) => {
          const position = peers[key].selection ?? null;
          const caret = carets.id(key);

          if (!caret.eq({ position })) {
            caret.change({ position });
            fireChange('remote', 'selection');
          }

          const textFocused = peers[key].textFocused ?? false;
          const opacity = textFocused ? 0.6 : 0.2;

          if (!caret.eq({ opacity })) {
            caret.change({ opacity });
            fireChange('remote', 'focus');
          }
        });
    }
  });

  /**
   * Keep track of current/previous selection offsets.
   */
  let _selection: t.SelectionOffset = { start: 0, end: 0 };
  editor.onDidChangeCursorSelection((e) => {
    if (api.disposed) return;
    const next = e.selection;
    _selection = Wrangle.offsets(monaco, editor, next);
    if (docPeers) docPeers.changeLocal((local) => (local.selection = Wrangle.asIRange(next)));
    fireChange('local', 'selection');
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

    fireChange('local', 'text');
  });

  /**
   * Track focus state.
   */
  const focusChanged = (isFocused: boolean) => {
    if (api.disposed) return;
    if (!args.peers) return;
    docPeers.changeLocal((local) => (local.textFocused = isFocused));
    fireChange('local', 'focus');
  };
  editor.onDidFocusEditorText(() => focusChanged(true));
  editor.onDidBlurEditorText(() => focusChanged(false));

  /**
   * API
   */
  const api: t.MonacoCrdtSyncer = {
    $: _$.pipe(rx.takeUntil(dispose$)),
    kind: 'crdt:monaco:syncer',
    dispose,
    dispose$,
    get disposed() {
      return _isDisposed;
    },
  };

  return api;
}
