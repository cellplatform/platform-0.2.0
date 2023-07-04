import { useEffect, useState } from 'react';
import { WebRtc, type t } from './common';

/**
 * Behavior controller for the <Connect> component.
 */
export function useController(args: { self?: t.Peer; onChange?: t.ConnectStatefulChangedHandler }) {
  const { self } = args;

  const [controller, setController] = useState<t.WebRtcController>();
  const [client, setClient] = useState<t.WebRtcEvents>();
  const [remote, setRemote] = useState('');
  const [spinning, setSpinning] = useState(false);

  /**
   * Lifecycle.
   */
  useEffect(() => {
    if (self) {
      const controller = WebRtc.controller(self);
      const client = controller.client();
      setController(controller);
      setClient(client);
    }
    return () => {
      controller?.dispose();
      client?.dispose();
    };
  }, [self?.id]);

  useEffect(() => {
    args.onChange?.({ data });
  }, [remote, spinning]);

  /**
   * Data Object
   */
  const data: t.WebRtcInfoData = {
    connect: {
      self,
      remote,
      spinning,
      onLocalCopied: (e) => navigator.clipboard.writeText(e.local),
      onRemoteChanged: (e) => setRemote(e.remote),
      async onConnectRequest(e) {
        setSpinning(true);
        await client?.connect.fire(e.remote);
        setSpinning(false);
      },
    },
  };

  /**
   * API
   */
  return { client, data } as const;
}
