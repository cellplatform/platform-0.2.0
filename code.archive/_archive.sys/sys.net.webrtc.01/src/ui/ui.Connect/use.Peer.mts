import { useEffect, useState } from 'react';
import { peer } from './Root.peer.mjs';
import { rx, type t } from './common';

/**
 * HOOK: Pass-through [OR] generate a network peer.
 */
export function usePeer(input?: t.Peer) {
  const [self, setSelf] = useState<t.Peer>();

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (typeof input === 'object') {
      setSelf(input);
    } else {
      peer({ dispose$ }).then((res) => setSelf(res));
    }
    return dispose;
  }, [input?.id]);

  return self;
}
