import { calculateDiff } from './-tmp.diff';

import { ObjectPath, DEFAULTS, Doc, Path, Pkg, rx, type t } from './common';
import { MonacoPatcher } from './u.MonacoPatch';

type O = Record<string, unknown>;
type Options = {
  debugLabel?: string;
  strategy?: t.EditorUpdateStrategy | (() => t.EditorUpdateStrategy | undefined);
  paths?: t.EditorPaths;
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
  const paths = wrangle.paths(options);

  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;
  dispose$.subscribe(() => {
    editor.setValue('');
    handlerContentChanged.dispose();
    handlerSelectionChanged.dispose();
  });

  /**
   * Helpers.
   */
  const patchMonaco = MonacoPatcher.init(monaco, editor);
  const events = lens.events(dispose$);
  const Lens = {
    get current() {
      return Lens.resolve(lens.current);
    },
    resolve(d: O) {
      return Path.Object.resolve<string>(d, paths.text);
    },
    text: {
      splice(d: O, index: number, del: number, value?: string) {
        Doc.Text.splice(d, paths.text, index, del, value);
      },
      replace(d: O, value: string) {
        Path.Object.Mutate.value(d, paths.text, value);
      },
    },
  } as const;

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
   * CRDT changed.
   */
  events.changed$.pipe(rx.filter(() => !_ignoreChange)).subscribe((e) => {
    const before = editor.getValue();
    const after = Lens.resolve(e.after) ?? '';
    if (after === before) return;

    /**
     * TODO 🐷
     */
    const diff = calculateDiff(Lens.resolve(e.before) || '', Lens.resolve(e.after) || '');
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
        lens.change((d) => Lens.text.splice(d, index, deleteCount, change.text));
      }

      if (strategy === 'Overwrite') {
        lens.change((d) => Lens.text.replace(d, editor.getValue()));
      }
    });
  });

  /**
   * Editor: selection changed.
   */
  const handlerSelectionChanged = editor.onDidChangeCursorSelection((e) => {
    if (life.disposed) return;
    lens.change((d) => ObjectPath.Mutate.value(d, paths.selection, e.selection));
  });

  /**
   * Initial state.
   */
  const initial = Lens.current;
  if (initial === undefined) {
    lens.change((d) => Path.Object.Mutate.value(d, paths.text, ''));
  } else if (typeof initial === 'string') {
    changeEditorText(initial);
  }

  /**
   * API
   */
  const api: t.SyncListener = {
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

const wrangle = {
  paths(options: Options) {
    return options.paths ?? DEFAULTS.paths;
  },
} as const;
