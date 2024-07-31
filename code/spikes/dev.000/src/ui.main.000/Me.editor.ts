import { Doc, Monaco, rx, type t } from './common';

type O = Record<string, unknown>;

/**
 * Controller
 */
export function editorController(args: {
  main: t.Shell;
  editor: t.MonacoCodeEditor;
  monaco: t.Monaco;
  dispose$?: t.UntilObservable;
}): t.ShellEditorController {
  const { monaco, editor, main } = args;
  const life = rx.lifecycle(args.dispose$);
  const { dispose$ } = life;
  const cmdbar = main.cmdbar;

  // Document (State).
  type T = { config?: t.EditorState; code?: unknown };
  const lens = Doc.lens<O, T>(main.state.me, ['root'], { init: (d) => (d.root = {}) });
  const codeLens = Doc.lens(lens, ['code'], (d) => (d.code = {}));

  /**
   * Ensure there is a {config} object.
   */
  if (typeof lens.current.config !== 'object') {
    const text = (lens.current.config as any)?.text ?? '';
    lens.change((d) => (d.config = { text, selections: [] }));
  }

  /**
   * Editor state.
   */
  const Syncer = Monaco.Crdt.Syncer;
  Syncer.listen(monaco, editor, codeLens, { strategy: 'Overwrite', dispose$ });

  const selection$ = rx.subject();
  editor.onDidChangeCursorSelection(() => selection$.next());
  selection$.pipe(rx.takeUntil(life.dispose$), rx.debounceTime(300)).subscribe((e) => {
    lens.change((d) => (d.config!.selections = editor.getSelections() || []));
  });

  /**
   * Editor keyboard.
   */
  const { KeyMod, KeyCode } = monaco;
  editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyK, () => cmdbar?.ctrl.focus({}));
  editor.addCommand(KeyMod.CtrlCmd | KeyCode.Enter, async (e) => {
    const res = await cmdbar?.ctrl.current({}).promise();
    const text = res?.result?.text || '';
    cmdbar?.ctrl.invoke({ text });
  });

  // Focus editor when <CmdBar> is blurred (via CMD+J).
  const ctrlEvents = cmdbar?.ctrl.events(life.dispose$);
  ctrlEvents?.on('Focus', (e) => {
    if (e.params.target === 'Main') editor.focus();
  });

  /**
   * Initial editor state.
   */
  if (lens.current.config?.selections) {
    const list = lens.current.config.selections;
    try {
      if (list.length > 0) editor.setSelections(list);
    } catch (error) {
      console.error(`Failed while setting code-editor {selections}.`, error);
    }
  }

  // Finish up.
  return life;
}
