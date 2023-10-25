import { useEffect, useState } from 'react';
import { type t } from './common';

export function useRedraw(data: t.InfoData = {}) {
  const peer = data.peer?.self;

  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  useEffect(() => {
    const events = peer?.events();
    events?.cmd.conn$.subscribe(redraw);
    return events?.dispose;
  }, [peer?.id]);
}
