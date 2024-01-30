import { Doc, Path, rx, type t } from './common';
import { MonacoPatcher } from './u.MonacoPatch';

type O = Record<string, unknown>;

/**
 * An adapter for managing 2-way binding between a code-editor UI
 * component and a CRDT (Automerge.Text) data-structure.
 */
export function listen<T extends O>(
  monaco: t.Monaco,
  editor: t.MonacoCodeEditor,
  lens: t.Lens<T>,
  target: t.TypedJsonPath<T>,
  options: { dispose$?: t.UntilObservable; debugLabel?: string } = {},
) {
  const { debugLabel } = options;
  const life = rx.lifecycle(options.dispose$);
  life.dispose$.subscribe(() => handlerDidChangeModelContent.dispose());

  /**
   * Helpers.
   */
  const monacoPatch = MonacoPatcher.init(monaco, editor);
  const Events = { lens: lens.events(life.dispose$) } as const;
  const Lens = {
    get code() {
      return Lens.resolve(lens.current);
    },
    resolve(doc: T) {
      return Path.resolve<string>(doc, target) ?? '';
    },
    splice(doc: T, index: number, del: number, text?: string) {
      Doc.splice(doc, [...target], index, del, text);
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
    const prev = editor.getValue();
    const next = Lens.resolve(e.after);
    if (next === prev) return;

    const source = 'crdt-sync';
    const patches = e.patches.filter((patch) => startsWith(patch.path, target));
    patches.forEach((patch) => {
      _ignoreChange = true;
      if (patch.action === 'del') monacoPatch.delete(patch, `${source}:delete`);
      if (patch.action === 'splice') monacoPatch.splice(patch, `${source}:update`);
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
      lens.change((d) => Lens.splice(d, index, deleteCount, change.text));
    });
  });

  /**
   * Initialize.
   */
  const initial = Lens.code;
  if (typeof initial === 'string') changeEditorText(initial);
  return life;
}

/**
 * Helpers
 */
function startsWith(list: any[], m: any[]): boolean {
  return list.length >= m.length && m.every((value, index) => value === list[index]);
}
