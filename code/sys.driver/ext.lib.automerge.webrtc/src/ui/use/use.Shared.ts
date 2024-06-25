import { useEffect, useState } from 'react';
import { type t } from './common';

/**
 * Provides the async [Shared] network state when it's ready.
 */
export function useShared(network?: t.NetworkStore) {
  const peer = network?.peer;
  const [shared, setShared] = useState<t.OmitLifecycle<t.CrdtSharedState>>();

  useEffect(() => {
    setShared(network?.shared);
  }, [peer?.id, network?.shared?.doc.uri]);

  return shared;
}
