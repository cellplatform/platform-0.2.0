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
  const [selected, setSelected] = useState<t.PeerId>();
  const [copiedMessage, setCopiedMessage] = useState('');
  const [count, setCount] = useState(0);
  const registerChange = () => setCount((prev) => prev + 1);

  const fireChange = () => {
    const payload = Wrangle.event(client, selected);
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
  const fireOn = [client?.instance.id, count, remote, spinning, selected, copiedMessage];
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
        rx.filter(() => !selected),
        rx.map((e) => e.connections[0].peer.remote),
      ).subscribe((e) => setSelected(e));
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
      selected: selected,
      onPeerSelect: (e) => setSelected(e.peerid),
      onPeerCtrlClick: (e) => console.info('⚡️ onPeerCtrlClick', e),
    },
  };

  /**
   * API
   */
  return {
    client,
    info,
    copied: Wrangle.copied(copiedMessage),
    event: Wrangle.event(client, selected),
  } as const;
}

/**
 * Helpers
 */
const Wrangle = {
  copied(message?: string) {
    return message ? { message } : undefined;
  },

  event(client?: t.WebRtcEvents, selected?: t.PeerId) {
    if (!client) return;
    const payload: t.ConnectChangedHandlerArgs = { client, selected };
    return payload;
  },
};
