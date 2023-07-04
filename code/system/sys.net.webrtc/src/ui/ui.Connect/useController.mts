import { useEffect, useState } from 'react';
import { WebRtc, rx, type t } from './common';

/**
 * Behavior controller for the <Connect> component.
 */
export function useController(args: { self?: t.Peer; onChange?: t.ConnectStatefulChangedHandler }) {
  const { self } = args;

  const [client, setClient] = useState<t.WebRtcEvents>();
  const [remote, setRemote] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState('');

  const fireChange = () => {
    if (self && client) args.onChange?.({ self, data, client });
  };

  const connectToPeer = async (remote: t.PeerId) => {
    setSpinning(true);
    await client?.connect.fire(remote);
    setSpinning(false);
  };

  /**
   * Alert listeners via [onChange] event.
   */
  useEffect(fireChange, [client?.instance.id, remote, spinning, selectedPeer]);

  /**
   * Initialize controller
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

  /**
   * Ensure [selectedPeer].
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    if (client) {
      const $ = client.connections.changed.$.pipe(rx.takeUntil(dispose$));
      $.subscribe((e) => {
        // NB: If no peer is selected then select the first remote.
        if (!selectedPeer) setSelectedPeer(e.connections[0].peer.remote);
      });
    }

    return dispose;
  }, [client?.instance.id]);

  /**
   * Data Object.
   */
  const data: t.WebRtcInfoData = {
    connect: {
      self,
      remote,
      spinning,
      onLocalCopied: (e) => navigator.clipboard.writeText(e.local),
      onRemoteChanged: (e) => setRemote(e.remote),
      onConnectRequest: (e) => connectToPeer(e.remote),
    },
    group: {
      useController: true,
      selected: selectedPeer,
      onPeerSelect: (e) => setSelectedPeer(e.peerid),
      onPeerCtrlClick: (e) => console.info('⚡️ onPeerCtrlClick', e),
    },
  };

  /**
   * API
   */
  return { client, data } as const;
}
