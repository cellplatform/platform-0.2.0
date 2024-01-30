import { DEFAULTS, Doc, Monaco, Path, rx, type t } from './common';

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
  options: {
    debounce?: t.Msecs;
    dispose$?: t.UntilObservable;
  } = {},
) {
  const { debounce = DEFAULTS.debounce } = options;
  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;

  dispose$.subscribe(() => {
    handlerDidChangeModelContent.dispose();
    handlerDidChangeCursorSelection.dispose();
  });

  const Events = {
    lens: lens.events(dispose$),
  } as const;

  const Code = {
    get current() {
      return Path.resolve(lens.current, target);
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
   * Keep track of current/previous selection offsets.
   */
  let _lastSelection: t.SelectionOffset[] = [];
  const handlerDidChangeCursorSelection = editor.onDidChangeCursorSelection((e) => {
    if (life.disposed) return;

    const next = editor.getSelections() || [];
    _lastSelection = next.map((range) => Monaco.Wrangle.monaco(monaco).offsets(editor, range));

    // console.log('_lastSelection', _lastSelection);
    // if (args.peers) {
    //   const selections = next.map((next) => Wrangle.asRange(next));
    //   docPeers.changeLocal((local) => (local.selections = selections));
    // }

    // fireChange('local', 'selection');
  });

  /**
   * CRDT changed.
   */
  Events.lens.changed$.pipe().subscribe((e) => {
    const prev = editor.getValue();
    const next = Code.current;

    console.log('next', next, e);
    // const next = (e.after[codeKey] ?? '') as string;
    // if (prev !== next) changeEditorText(next);
  });

  /**
   * Local editor changed.
   */
  const handlerDidChangeModelContent = editor.onDidChangeModelContent((e) => {
    if (life.disposed) return;
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
      lens.change((d) => {
        _lastSelection.forEach(({ start, end }) => Code.splice(d, start, end - start));
      });
    }

    /**
     * Apply each change to the CRDT text field.
     * https://automerge.org/automerge/api-docs/js/functions/next.splice.html
     */
    e.changes.forEach((change) => {
      lens.change((d) => {
        const i = change.rangeOffset;
        if (change.text === '') {
          Code.splice(d, i, change.rangeLength); // Delete.
        } else {
          Code.splice(d, i, 0, change.text); // Update.
        }
      });
    });
  });

  /**
   * API
   */
  const api = {
    /**
     * Lifecycle
     */
    dispose,
    dispose$,
    get disposed() {
      return life.disposed;
    },
  } as const;

  /**
   * Initialize
   */
  const initial = Code.current;
  if (typeof initial === 'string') changeEditorText(initial);

  return api;
}
