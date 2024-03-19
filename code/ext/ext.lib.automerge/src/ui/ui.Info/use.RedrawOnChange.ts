import { useEffect, useState } from 'react';
import { rx, type t } from './common';

export function useRedrawOnChange(data: t.InfoData) {
  const crdt = {
    document: data.document?.doc,
    history: data.history?.doc,
  } as const;

  const [, setCount] = useState(0);
  const redraw = () => setCount((n) => n + 1);

  useEffect(() => {
    const life = rx.lifecycle();
    const monitor = (doc?: t.DocRef<unknown>) => {
      if (!doc) return;
      const events = doc.events(life.dispose$);
      events.changed$.pipe(rx.debounceTime(150)).subscribe(redraw);
    };
    monitor(crdt.document);
    monitor(crdt.history);
    return life.dispose;
  }, [crdt.document?.uri, crdt.history?.uri]);
}
