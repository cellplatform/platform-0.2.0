import { useEffect } from 'react';
import { Ctrl, DEFAULTS, ObjectPath, rx, type t } from './common';

/**
 * Manage history
 */
export function useHistory(args: {
  enabled?: boolean;
  state?: t.CmdImmutable;
  ctrl?: t.CmdBarCtrl;
  paths?: t.CmdBarPaths;
}) {
  const { enabled = true, state, ctrl, paths = DEFAULTS.paths } = args;
  const pathDeps = `${paths.text.join('.')}`;
  const resolve = Ctrl.Path.resolver(paths);

  useEffect(() => {
    const life = rx.disposable();

    if (enabled && ctrl && state) {
      const events = ctrl.events(life.dispose$);
      const append = () => {
        const text = api.text.trim();
        const history = api.history;
        const latest = history[history.length - 1];
        if (text && latest !== text) {
          state.change((d) => {
            const list = resolve(d).history;
            list.push(text);
            if (!ObjectPath.exists(d, paths.history)) ObjectPath.mutate(d, paths.history, list);
          });
        }
      };

      /**
       * Save new items to history on "ENTER" (Invoke).
       */
      events.on('Invoke', (e) => append());
    }

    if (!enabled) life.dispose();
    return life.dispose;
  }, [enabled, ctrl, state?.instance, pathDeps]);

  /**
   * API
   */
  const api = {
    enabled,
    get text() {
      return state ? resolve(state.current).text : '';
    },
    get history() {
      return state ? resolve(state.current).history : [];
    },
  } as const;
  return api;
}
