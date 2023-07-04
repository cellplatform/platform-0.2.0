import { useEffect, useState } from 'react';
import { rx, WebRtc, type t } from './common';

/**
 * Behavior controller for the <Connect> component.
 */
export function useController(args: { self?: t.Peer; onChange?: t.ConnectStatefulChangedHandler }) {
  const { self } = args;

  const [client, setClient] = useState<t.WebRtcEvents>();
  const [remote, setRemote] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState('');

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    if (self) {
      const controller = WebRtc.controller(self, { dispose$ });
      const client = controller.client(dispose$);
      setClient(client);
    }

    return dispose;
  }, [self?.id]);

  useEffect(() => {
    if (self && client) {
      args.onChange?.({ self, data, client });
    }
  }, [remote, spinning, client?.instance.id]);

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
        if (!selectedPeer) setSelectedPeer(e.remote);
        setSpinning(false);
      },
    },
    group: {
      useController: true,
      selected: selectedPeer,
      onPeerSelect(e) {
        setSelectedPeer(e.peerid);
      },
      onPeerCtrlClick(e) {
        console.info('⚡️ onPeerCtrlClick', e);
      },
    },
  };

  /**
   * API
   */
  return { client, data } as const;
}
