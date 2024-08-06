import { rx, type t } from './common';
import { Util } from './u';

type PathsInput = t.EditorPaths | t.ObjectPath;

/**
 * Start <Cmd> controller for the code-editor.
 */
export function listen(
  ctrl: t.SyncCmdMethods,
  args: {
    editor: t.MonacoCodeEditor;
    identity: string;
    carets: t.EditorCarets;
    paths?: PathsInput;
    dispose$?: t.UntilObservable;
  },
) {
  const { identity, carets } = args;
  const cmd = Util.Cmd.toCmd(ctrl);
  const paths = Util.Path.wrangle(args.paths);

  const life = rx.lifecycle(args.dispose$);
  const { dispose, dispose$ } = life;
  const events = Util.Cmd.toCmd(ctrl).events(dispose$);

  /**
   * Handlers
   */
  events.on('Ping', (e) => {
    if (e.params.identity === identity) {
      const ok = true;
      cmd.invoke('Ping:R', { identity, ok }, e.tx);
    }
  });

  /**
   * API
   */
  return {
    // Lifecycle.
    dispose,
    dispose$,
    get disposed() {
      return life.disposed;
    },
  } as const;
}
