import { useEffect, useRef, useState } from 'react';
import { Model, rx, type t } from './common';

export function useListState(peer?: t.PeerModel, onReady?: t.ConnectorReadyHandler) {
  const [list, setList] = useState<t.LabelListState>();
  const readyRef = useRef(false);

  useEffect(() => {
    const { dispose$, dispose } = rx.disposable();
    if (peer) {
      const model = Model.List.init(peer, { dispose$ });
      const list = model.list;
      setList(list);
      if (!readyRef.current) onReady?.({ peer, list });
      readyRef.current = true;
    }
    return dispose;
  }, [peer?.id]);

  return { list } as const;
}
