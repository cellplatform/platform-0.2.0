import { useEffect } from 'react';
import { Model, R, rx, type t } from './common';

export function useSelection(args: {
  peer: t.PeerModel;
  list: t.LabelListState;
  onSelectionChange?: t.ConnectorSelectionHandler;
}) {
  const { peer, list } = args;

  /**
   * Lifecycle
   */
  useEffect(() => {
    const { dispose$, dispose } = rx.disposable();

    /**
     * Listen.
     */
    const events = list.events(dispose$);
    rx.merge(events.active.selected$, events.total$)
      .pipe(
        rx.map(() => Wrangle.selectionEvent(peer, list)),
        rx.filter(Boolean),
        rx.distinctWhile((prev, next) => R.equals(prev.selection, next.selection)),
      )
      .subscribe((e) => args.onSelectionChange?.(e));

    return dispose;
  }, [peer.id]);

  /**
   * API
   */
  return { list } as const;
}

/**
 * Helpers
 */
export const Wrangle = {
  selectionEvent(peer: t.PeerModel, list: t.ConnectorListState) {
    if (!list.current.getItem) return;

    const [item, index] = list.current.getItem(list.current.selected);
    if (!item || index < 0) return;

    const kind = Model.Data.kind(item);
    const peerid = Model.Data.peerid(item);
    const res: t.ConnectorSelectionHandlerArgs = {
      peer,
      selection: { index, kind, peerid },
    };
    return res;
  },
} as const;
