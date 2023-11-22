import { rx, type t } from './common';

/**
 * Factory for the Index events objectl
 */
export function events(index: t.StoreIndex, options: { dispose$?: t.UntilObservable } = {}) {
  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;

  /**
   * API
   */
  const api: t.StoreIndexEvents = {
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
