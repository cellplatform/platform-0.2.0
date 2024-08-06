import { calculateDiff } from './-tmp.diff';

import { DEFAULTS, Monaco, ObjectPath, Path, Pkg, rx, type t } from './common';
import { SyncerCmd } from './Syncer.Cmd';
import { Util } from './u';

type Options = {
  debugLabel?: string;
  strategy?: t.EditorUpdateStrategy | (() => t.EditorUpdateStrategy | undefined);
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
    editor.setValue('');
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
  const identity$ = Util.Identity.observable.identity$(changed$, paths);

  /**
   * Editor <Cmd>'s
   */
  const cmd = Util.Cmd.create(lens, { paths });
  const syncer = SyncerCmd.listen(cmd, { lens, editor, carets, self, paths, dispose$ });

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
      console.log(`TODO [${Pkg.name}] 🐷 diff:`, diff);

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
      const selections = e.after.selections;
      carets.identity(e.identity).change({ selections });
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

      const strategy = api.strategy;
      if (strategy === 'Splice') {
        lens.change((d) => Text.splice(d, index, deleteCount, change.text));
      }

      if (strategy === 'Overwrite') {
        lens.change((d) => Text.replace(d, editor.getValue()));
      }
    });
  });

  /**
   * Editor: selection changed.
   */
  const selectionChangedHandler = editor.onDidChangeCursorSelection((e) => {
    if (life.disposed) return;
    lens.change((d) => {
      const path = Util.Path.identity(identity);
      const selections = editor.getSelections();
      Mutate.value(d, path.selections, selections);
    });
  });

  /**
   * API
   */
  const api: t.SyncListener = {
    cmd,
    identity,
    changed: { identity$ },

    get strategy() {
      const { strategy } = options;
      if (typeof strategy === 'string') return strategy;
      if (typeof strategy === 'function') strategy() ?? DEFAULTS.strategy;
      return DEFAULTS.strategy;
    },

    /**
     * Lifecycle
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
  cmd.purge({ identity });
  const initialText = Text.current;
  if (initialText === undefined) {
    lens.change((d) => Path.Object.Mutate.value(d, paths.text, ''));
  } else if (typeof initialText === 'string') {
    changeEditorText(initialText);
  }

  // Finish up.
  return api;
}

/**
 * Helpers
 */
function startsWith(list: any[], m: any[]): boolean {
  return list.length >= m.length && m.every((value, index) => value === list[index]);
}
