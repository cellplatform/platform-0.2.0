import { rx, toObject, type t } from './common';

/**
 * Adapter for running an RPC style function
 * based on an observable CRDT.
 */
export function init<P extends {} = {}>(
  lens: t.CrdtFuncLens,
  handler: t.CrdtFuncHandler,
): t.CrdtFunc<P> {
  const lifecycle = rx.lifecycle(lens.dispose$);
  const { dispose, dispose$ } = lifecycle;

  lens.$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
    const count = e.lens.count.value;
    const params = toObject(e.lens.params);
    handler({ count, params });
  });

  const api: t.CrdtFunc<P> = {
    kind: 'Crdt:Func',

    /**
     * Invoke the function.
     */
    invoke(params: P) {
      lens.change((d) => {
        d.params = params;
        d.count.increment(1); // NB: <any> because of Automerge type bug.
      });
    },

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
