import { rx, type t } from './common';

export function eventsFactory(
  repo: t.RepoListModel,
  options: { dispose$?: t.UntilObservable } = {},
): t.RepoListEvents {
  const life = rx.lifecycle([repo.dispose$, options.dispose$]);
  const { dispose, dispose$ } = life;

  const api: t.RepoListEvents = {
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
