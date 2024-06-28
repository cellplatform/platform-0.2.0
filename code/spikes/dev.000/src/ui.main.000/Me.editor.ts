import { rx, CmdBar, Doc, Monaco, type t } from './common';

/**
 * Controller
 */
export function editorController(args: {
  editor: t.MonacoCodeEditor;
  monaco: t.Monaco;
  main: t.Shell;
  dispose$?: t.UntilObservable;
}): t.ShellEditorController {
  const { monaco, editor, main } = args;
  const life = rx.lifecycle(args.dispose$);

  // Document (State)
  type T = { config?: string };
  const lens = Doc.lens(main.state.me, ['root'], { init: (d) => (d.root = {}) });

  // TEMP 🐷 clear out old fields.
  lens.change((d) => {
    delete d['code'];
    // delete d['config'];
  });

  const Syncer = Monaco.Crdt.Syncer;
  Syncer.listen<T>(monaco, editor, lens, ['config'], { strategy: 'Overwrite' });

  // Editor
  const cmdbar = CmdBar.Ctrl.methods(main.cmd.cmdbar);
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => cmdbar.focus({}));

  // Focus editor when <CmdBar> is blurred (via CMD+J)
  main.cmd.cmdbar.events(life.dispose$).on('Blur', () => editor.focus());

  // Finish up.
  return life;
}
