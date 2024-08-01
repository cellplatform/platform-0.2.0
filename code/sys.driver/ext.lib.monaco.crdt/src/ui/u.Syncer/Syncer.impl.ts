import { calculateDiff } from './-tmp.diff';

import { DEFAULTS, ObjectPath, Path, Pkg, rx, type t } from './common';
import { Util } from './u';

type Options = {
  debugLabel?: string;
  strategy?: t.EditorUpdateStrategy | (() => t.EditorUpdateStrategy | undefined);
  paths?: t.EditorPaths;
  identity?: string;
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
  const identity = Util.Identity.format(options.identity);
  const Mutate = ObjectPath.Mutate;

  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;
  dispose$.subscribe(() => {
    handlerContentChanged.dispose();
    handlerSelectionChanged.dispose();
    editor.setValue('');
  });

  /**
   * Observables.
   */
  const events = lens.events(dispose$);
  const changed$ = events.changed$.pipe(rx.filter(() => !_ignoreChange));

  /**
   * Helpers.
   */
  const patchMonaco = Util.Patch.init(monaco, editor);
  const Text = Util.Lens.text(lens, paths);

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
   * Editor: text changed.
   */
  const handlerContentChanged = editor.onDidChangeModelContent((e) => {
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
  const handlerSelectionChanged = editor.onDidChangeCursorSelection((e) => {
    if (life.disposed) return;
    lens.change((d) => {
      const path = Util.Path.identity(identity);
      Mutate.value(d, path.selection, e.selection);
    });
  });

  /**
   * Initial state.
   */
  const initialText = Text.current;
  if (initialText === undefined) {
    lens.change((d) => Path.Object.Mutate.value(d, paths.text, ''));
  } else if (typeof initialText === 'string') {
    changeEditorText(initialText);
  }

  /**
   * API
   */
  const api: t.SyncListener = {
    identity,
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
  return api;
}

/**
 * Helpers
 */
function startsWith(list: any[], m: any[]): boolean {
  return list.length >= m.length && m.every((value, index) => value === list[index]);
}
