import { useEffect, useState } from 'react';
import { rx, type t } from './common';

export function useRedraw(peer?: t.PeerModel) {
  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  useEffect(() => {
    const events = peer?.events();
    events?.$.pipe(rx.throttleAnimationFrame()).subscribe(redraw);
    return events?.dispose;
  }, [peer?.id]);
}
