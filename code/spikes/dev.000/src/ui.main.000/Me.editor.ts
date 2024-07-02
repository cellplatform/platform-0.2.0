import { CmdBar, Doc, Monaco, rx, type t } from './common';

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

  // Document (State).
  type T = { config?: t.EditorState };
  const lens = Doc.lens<O, T>(main.state.me, ['root'], { init: (d) => (d.root = {}) });

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
  Syncer.listen(monaco, editor, lens, ['config', 'text'], { strategy: 'Overwrite' });

  const selection$ = rx.subject();
  editor.onDidChangeCursorSelection(() => selection$.next());
  selection$.pipe(rx.takeUntil(life.dispose$), rx.debounceTime(300)).subscribe((e) => {
    lens.change((d) => (d.config!.selections = editor.getSelections() || []));
  });

  /**
   * Editor keyboard.
   */
  const cmdbar = CmdBar.Ctrl.methods(main.cmd.cmdbar);
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => cmdbar.focus({}));

  // Focus editor when <CmdBar> is blurred (via CMD+J).
  main.cmd.cmdbar.events(life.dispose$).on('Blur', () => editor.focus());

  /**
   * Initial editor state.
   */
  if (lens.current.config?.selections) editor.setSelections(lens.current.config.selections);

  // Finish up.
  return life;
}
