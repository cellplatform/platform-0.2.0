import { rx, type t } from './common';
import { Util } from './u';

type PathsInput = t.EditorPaths | t.ObjectPath;

/**
 * Start <Cmd> controller for the code-editor.
 */
export function listen(
  ctrl: t.SyncCmdMethods,
  args: {
    lens: t.Immutable;
    editor: t.MonacoCodeEditor;
    self: t.IdString;
    carets: t.EditorCarets;
    paths?: PathsInput;
    dispose$?: t.UntilObservable;
  },
) {
  const { self, lens, carets } = args;
  const cmd = Util.Cmd.toCmd(ctrl);
  const paths = Util.Path.wrangle(args.paths);

  const life = rx.lifecycle(args.dispose$);
  const { dispose, dispose$ } = life;
  const events = Util.Cmd.toCmd(ctrl).events(dispose$);

  /**
   * Handlers
   */
  events.on('Ping', (e) => {
    if (e.params.identity !== self) return;
    cmd.invoke('Ping:R', { identity: self, ok: true }, e.tx);
  });

  events.on('Purge', async (e) => {
    if (e.params.identity !== self) return;
    const res = await Util.Cmd.purge(ctrl, { lens, self, paths });
    cmd.invoke('Purge:R', res, e.tx);
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
