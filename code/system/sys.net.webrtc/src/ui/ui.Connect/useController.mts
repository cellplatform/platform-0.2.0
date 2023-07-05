import { useEffect, useState } from 'react';
import { DEFAULTS, Time, WebRtc, rx, type t } from './common';

/**
 * HOOK: Stateful behavior controller for the <Connect> component.
 */
export function useController(args: { self?: t.Peer; onChange?: t.ConnectChangedHandler }) {
  const { self } = args;

  const [client, setClient] = useState<t.WebRtcEvents>();
  const [remote, setRemote] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState('');
  const [copiedMessage, setCopiedMessage] = useState('');
  const [count, setCount] = useState(0);
  const registerChange = () => setCount((prev) => prev + 1);

  const fireChange = () => {
    const payload = api.event;
    if (payload) args.onChange?.(payload);
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
  const fireOn = [client?.instance.id, count, remote, spinning, selectedPeer, copiedMessage];
  useEffect(fireChange, fireOn);

  /**
   * Ensure [selectedPeer].
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    if (client) {
      const $ = client.connections.changed.$.pipe(rx.takeUntil(dispose$));
      $.pipe(rx.debounceTime(50)).subscribe(registerChange);

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
  const api = {
    client,
    info,
    copied: Wrangle.copied(copiedMessage),
    get event(): t.ConnectChangedHandlerArgs | undefined {
      if (!self) return;
      return {
        self,
        selected: Wrangle.selected(self, selectedPeer),
      };
    },
  } as const;

  return api;
}

/**
 * Helpers
 */
const Wrangle = {
  copied(message?: string) {
    return message ? { message } : undefined;
  },

  selected(self: t.Peer, peerid?: t.PeerId): t.ConnectSelected | undefined {
    if (!peerid) return undefined;
    return {
      peer: {
        id: peerid,
        self: self.id === peerid,
      },
      stream: Wrangle.selectedStream(self, peerid),
    } as const;
  },

  selectedStream(self: t.Peer, peerid?: t.PeerId) {
    const isSelf = self.id === peerid;
    const conns = Wrangle.mediaConnections(self, peerid);
    const conn = conns[0];
    if (!conn) return undefined;
    return isSelf ? conn.stream.local : conn.stream.remote;
  },

  mediaConnections(self: t.Peer, peerid?: t.PeerId) {
    type T = t.PeerConnectionsByPeer;
    const isSelf = self.id === peerid;
    const isMatch = (conn: T) => peerid === (isSelf ? conn.peer.local : conn.peer.remote);
    return self.connectionsByPeer.find((conn) => isMatch(conn))?.media ?? [];
  },
};
