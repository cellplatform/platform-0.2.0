import { calculateDiff } from './-tmp.diff';

import { Monaco, ObjectPath, rx, type t } from './common';
import { SyncerCmd } from './Syncer.Cmd';
import { Util } from './u';

type Options = {
  debugLabel?: string;
  paths?: t.EditorPaths | t.ObjectPath;
  identity?: string; // Unique identifier (URI) representing the user/editor.
  dispose$?: t.UntilObservable;
};

/**
 * An adapter for managing 2-way binding between a code-editor UI
 * component and a CRDT (Automerge.Text) data-structure.
 */
export function listen(
  monaco: t.Monaco,
  editor: t.MonacoCodeEditor,
  lens: t.Lens | t.Doc,
  options: Options = {},
): t.SyncListener {
  const { debugLabel } = options;
  const paths = Util.Path.wrangle(options.paths);
  const Mutate = ObjectPath.Mutate;
  const identity = Util.Identity.format(options.identity);
  const self = identity;

  /**
   * Lifecycle.
   */
  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;
  dispose$.subscribe(() => {
    textChangedHandler.dispose();
    selectionChangedHandler.dispose();
    carets.clear();
    editor.setValue('');
    lens.change((d) => Mutate.delete(d, Util.Path.identity(identity, paths).self));
  });

  /**
   * Helpers.
   */
  const Text = Util.Lens.text(lens, paths);
  const patchMonaco = Util.Patch.monaco(monaco, editor);
  const carets = Monaco.Carets.create(editor, { dispose$ });

  /**
   * Observables.
   */
  const events = lens.events(dispose$);
  const changed$ = events.changed$.pipe(rx.filter(() => !_ignoreChange));
  const identity$ = Util.Identity.Observable.identity$(changed$, paths);
  const identities$ = Util.Identity.Observable.identities$(changed$, paths);

  /**
   * Editor <Cmd>'s.
   */
  const cmd = Util.Cmd.create(lens, self, { paths, dispose$ });
  SyncerCmd.listen(cmd, { lens, editor, carets, self, paths, debugLabel, dispose$ });

  /**
   * Editor change.
   */
  let _ignoreChange = false;
  const changeEditorText = (text: string) => {
    _ignoreChange = true;
    const before = editor.getSelections()!;
    editor.setValue(text);
    editor.setSelections(before);
    _ignoreChange = false;
  };

  /**
   * CRDT: text changed.
   */
  changed$
    .pipe(rx.distinctWhile((p, n) => Text.resolve(p.after) === Text.resolve(n.after)))
    .subscribe((e) => {
      const before = editor.getValue();
      const after = Text.resolve(e.after) ?? '';
      if (after === before) return;

      /**
       * TODO 🐷
       */
      const diff = calculateDiff(Text.resolve(e.before) || '', Text.resolve(e.after) || '');
      // console.log(`TODO [${Pkg.name}] 🐷 diff:`, diff);

      const source = 'crdt.sync';
      const patches = e.patches.filter((patch) => startsWith(patch.path, paths.text));
      patches.forEach((patch) => {
        _ignoreChange = true;
        if (patch.action === 'del') patchMonaco.delete(patch, `${source}:delete`);
        if (patch.action === 'splice') patchMonaco.splice(patch, `${source}:update`);
        _ignoreChange = false;
      });
    });

  /**
   * CRDT: Selection → Keep editor carets in sync.
   */
  identity$
    .pipe(
      rx.filter((e) => e.identity !== self),
      rx.filter((e) => !!e.after?.selections),
    )
    .subscribe((e) => {
      const selections = e.after!.selections;
      carets.identity(e.identity).change({ selections });
    });

  /**
   * CRDT: if the identity is removed (via a purge) and the editor
   *       it still alive ensure it's entry is replaced.
   */
  identity$
    .pipe(
      rx.filter((e) => e.identity === self),
      rx.filter((e) => !e.after),
      rx.filter(() => !life.disposed),
    )
    .subscribe((e) => {
      cmd.update.state({ identity, selections: true });
      cmd.update.editor({ identity, selections: true });
    });

  /**
   * CRDT: remove orphaned identity carets.
   */
  identities$.pipe(rx.debounceTime(100)).subscribe((e) => {
    cmd.update.editor({ identity, selections: true });
  });

  /**
   * Editor: text changed.
   */
  const textChangedHandler = editor.onDidChangeModelContent((e) => {
    if (life.disposed) return;
    if (_ignoreChange) return;

    /**
     * Apply each change to the CRDT text field.
     * https://automerge.org/automerge/api-docs/js/functions/next.splice.html
     */
    e.changes.forEach((change) => {
      const { startLineNumber, endLineNumber, startColumn, endColumn } = change.range;
      const isReplace = startLineNumber !== endLineNumber || startColumn !== endColumn;
      const index = change.rangeOffset;
      const deleteCount = isReplace ? change.rangeLength : 0;
      lens.change((d) => Text.splice(d, index, deleteCount, change.text));
    });
  });

  /**
   * Editor: selection changed.
   */
  const selectionChangedHandler = editor.onDidChangeCursorSelection((e) => {
    if (life.disposed) return;
    const path = Util.Path.identity(identity, paths).selections;
    const selections = editor.getSelections();
    lens.change((d) => Mutate.value(d, path, selections));
  });

  /**
   * API
   */
  const api: t.SyncListener = {
    cmd,
    identity,
    changed: { identity$ },

    /**
     * Lifecycle.
     */
    dispose,
    dispose$,
    get disposed() {
      return life.disposed;
    },
  };

  /**
   * Initial state.
   */
  (async () => {
    const text = Text.current;
    if (text === undefined) lens.change((d) => Mutate.value(d, paths.text, ''));
    else if (typeof text === 'string') changeEditorText(text);

    cmd.update.editor({ identity, selections: true });
    await cmd.purge({ identity }).promise();
  })();

  // Finish up.
  return api;
}

/**
 * Helpers
 */
function startsWith(list: any[], m: any[]): boolean {
  return list.length >= m.length && m.every((value, index) => value === list[index]);
}
