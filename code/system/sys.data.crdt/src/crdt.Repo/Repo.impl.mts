import { rx, type t } from './common';

/**
 * A repository containing [1..n] CRDT documents with
 * support for:
 *
 *   - file-system persistence
 *   - network synchronization
 *
 */
export function init(): t.CrdtRepo {
  const lifecycle = rx.lifecycle();
  const { dispose, dispose$ } = lifecycle;

  /**
   * API
   */
  const api: t.CrdtRepo = {
    kind: 'Crdt:Repo',

    /**
     * Lifecycle.
     */
    dispose,
    dispose$,
    get disposed() {
      return lifecycle.disposed;
    },
  };

  return api;
}
