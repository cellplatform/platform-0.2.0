import { useEffect, useState } from 'react';
import { DEFAULTS, Time, WebRtc, rx, type t } from './common';

/**
 * HOOK: Stateful behavior controller for the <Connect> component.
 */
export function useController(args: { self?: t.Peer; onChange?: t.ConnectStatefulChangedHandler }) {
  const { self } = args;

  const [client, setClient] = useState<t.WebRtcEvents>();
  const [remote, setRemote] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState('');
  const [copiedMessage, setCopiedMessage] = useState('');

  const fireChange = () => {
    if (!self || !client) return;
    args.onChange?.({ self, data: info, client });
  };

  const connectToPeer = async (remote: t.PeerId) => {
    setSpinning(true);
    await client?.connect.fire(remote);
    setSpinning(false);
  };

  /**
   * Initialize.
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
   * Alert listeners via [onChange] event.
   */
  useEffect(fireChange, [client?.instance.id, remote, spinning, selectedPeer]);

  /**
   * Ensure [selectedPeer].
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    if (client) {
      const $ = client.connections.changed.$.pipe(rx.takeUntil(dispose$));

      // NB: If no peer is selected then select the first remote.
      $.pipe(
        rx.filter(() => !selectedPeer),
        rx.map((e) => e.connections[0].peer.remote),
      ).subscribe((e) => setSelectedPeer(e));
    }

    return dispose;
  }, [client?.instance.id]);

  /**
   * Reset [copiedMessage] after a delay.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    Time.until(dispose$).delay(DEFAULTS.copied.delay, () => setCopiedMessage(''));
    return dispose;
  }, [copiedMessage]);

  /**
   * <Info> data.
   */
  const info: t.WebRtcInfoData = {
    connect: {
      self,
      remote,
      spinning,
      onLocalCopied: (e) => setCopiedMessage(DEFAULTS.copied.message),
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
  return { client, info, copiedMessage } as const;
}
