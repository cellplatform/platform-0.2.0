import { useEffect, useState } from 'react';
import { Model, rx, type t } from './common';
import { List } from './ui.List';

export function useListState(peer?: t.PeerModel, onReady?: t.ConnectorReadyHandler) {
  const [list, setList] = useState<t.LabelListState>();

  useEffect(() => {
    const { dispose$, dispose } = rx.disposable();
    if (peer) {
      const model = Model.List.init(peer, { dispose$ });
      const list = model.list;
      setList(list);
      onReady?.({ peer, list });
    }
    return dispose;
  }, [peer?.id]);

  return { list } as const;
}
