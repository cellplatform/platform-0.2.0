import { useEffect, useState } from 'react';
import { PeerModel, type t } from './common';

export function usePeer(peer: t.PeerJs) {
  const [model, setModel] = useState<t.PeerModel>();

  const [_, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  useEffect(() => {
    const model = PeerModel.wrap(peer);
    setModel(model);

    const events = model.events();
    events.$.subscribe(redraw);

    return events.dispose;
  }, []);

  /**
   * API
   */
  return { redraw, model } as const;
}
