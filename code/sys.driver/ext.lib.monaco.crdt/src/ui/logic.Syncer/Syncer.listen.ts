import { calculateDiff } from './-tmp.diff';
import { Doc, Path, rx, type t } from './common';
import { MonacoPatcher } from './u.MonacoPatch';

type O = Record<string, unknown>;
type Options = {
  debugLabel?: string;
  strategy?: t.UpdateTextStrategy | (() => t.UpdateTextStrategy | undefined);
  dispose$?: t.UntilObservable;
};

/**
 * An adapter for managing 2-way binding between a code-editor UI
 * component and a CRDT (Automerge.Text) data-structure.
 */
export function listen(
  monaco: t.Monaco,
  editor: t.MonacoCodeEditor,
  lens: t.Lens,
  target: t.ObjectPath, // NB: target path to write the editor string to.
  options: Options = {},
): t.SyncListener {
  const { debugLabel } = options;
  const life = rx.lifecycle(options.dispose$);
  life.dispose$.subscribe(() => handlerDidChangeModelContent.dispose());

  /**
   * Helpers.
   */
  const patchMonaco = MonacoPatcher.init(monaco, editor);
  const Events = { lens: lens.events(life.dispose$) } as const;
  const Lens = {
    get current() {
      return Lens.resolve(lens.current);
    },
    resolve(doc: O) {
      return Path.Object.resolve<string>(doc, target);
    },
    text: {
      splice(doc: O, index: number, del: number, value?: string) {
        Doc.Text.splice(doc, target, index, del, value);
      },
      replace(doc: O, value: string) {
        Path.Object.mutate(doc, target, value);
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
  Events.lens.changed$.pipe(rx.filter(() => !_ignoreChange)).subscribe((e) => {
    const before = editor.getValue();
    const after = Lens.resolve(e.after) ?? '';
    if (after === before) return;

    /**
     * TODO 🐷
     */
    const diff = calculateDiff(Lens.resolve(e.before) || '', Lens.resolve(e.after) || '');
    console.log('TODO 🐷 diff:', diff);

    const source = 'crdt.sync';
    const patches = e.patches.filter((patch) => startsWith(patch.path, target));
    patches.forEach((patch) => {
      _ignoreChange = true;
      if (patch.action === 'del') patchMonaco.delete(patch, `${source}:delete`);
      if (patch.action === 'splice') patchMonaco.splice(patch, `${source}:update`);
      _ignoreChange = false;
    });
  });

  /**
   * Local editor changed.
   */
  const handlerDidChangeModelContent = editor.onDidChangeModelContent((e) => {
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
   * Initialize.
   */
  const initial = Lens.current;
  if (initial === undefined) {
    lens.change((d) => Path.Object.mutate(d, target, ''));
  } else if (typeof initial === 'string') {
    changeEditorText(initial);
  }

  /**
   * API
   */
  const api: t.SyncListener = {
    get strategy() {
      const defaultValue: t.UpdateTextStrategy = 'Splice';
      const { strategy } = options;
      if (typeof strategy === 'string') return strategy;
      if (typeof strategy === 'function') strategy() ?? defaultValue;
      return defaultValue;
    },

    // Lifecycle.
    dispose: life.dispose,
    dispose$: life.dispose$,
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
