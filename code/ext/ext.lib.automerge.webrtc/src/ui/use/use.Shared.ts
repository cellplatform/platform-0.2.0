import { useEffect, useState } from 'react';
import { rx, type t } from './common';

/**
 * Provides the async [Shared] network state when it's ready.
 */
export function useShared(network?: t.WebrtcStore) {
  const peer = network?.peer;
  const [shared, setShared] = useState<t.OmitLifecycle<t.CrdtSharedState>>();

  /**
   * Monitor peer total.
   */
  useEffect(() => {
    const life = rx.lifecycle();
    network?.shared().then((shared) => {
      if (!life.disposed) setShared(shared);
    });
    return life.dispose;
  }, [peer?.id]);

  /**
   * API
   */
  return shared;
}
