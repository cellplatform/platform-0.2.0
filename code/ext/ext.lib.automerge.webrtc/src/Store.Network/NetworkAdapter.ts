import { NetworkAdapter, type PeerId, type RepoMessage } from '@automerge/automerge-repo';
import { Time, rx, type t } from '../common';

const kind: t.StoreNetworkKind = 'WebRTC';

/**
 * An Automerge repo network-adapter for WebRTC (P2P)
 *
 * Based on:
 *    MessageChannelNetworkAdapter (point-to-point)
 *    https://github.com/automerge/automerge-repo/blob/main/packages/automerge-repo-network-messagechannel/src/index.ts
 *
 */
export class WebrtcNetworkAdapter extends NetworkAdapter {
  #conn: t.PeerJsConnData;
  #isReady = false;
  #disconnected$ = rx.subject<void>();
  #message$ = rx.subject<t.WebrtcMessageAlert>();

  readonly message$: t.Observable<t.WebrtcMessageAlert>;
  readonly kind = kind;

  constructor(conn: t.PeerJsConnData) {
    if (!conn) throw new Error(`A peerjs data-connection is required`);
    super();
    this.#conn = conn;
    this.message$ = this.#message$.pipe(
      rx.takeUntil(this.#disconnected$),
      rx.filter(() => this.#isReady),
    );
  }

  connect(peerId: PeerId) {
    const senderId = (this.peerId = peerId);
    const conn = this.#conn;

    const handleOpen = () => this.#transmit({ type: 'arrive', senderId });
    const handleClose = () => this.emit('close');
    const handleData = (e: any) => {
      const message = e as t.WebrtcMessage;
      switch (message.type) {
        case 'arrive':
          const targetId = message.senderId;
          this.#transmit({ type: 'welcome', senderId, targetId });
          this.#announceConnection(targetId);
          break;

        case 'welcome':
          this.#announceConnection(message.senderId);
          break;

        default:
          let payload = message;
          if ('data' in message) payload = { ...message, data: toUint8Array(message.data) };
          this.emit('message', payload);
          this.#alert('incoming', message);
          break;
      }
    };

    conn.on('open', handleOpen);
    conn.on('close', handleClose);
    conn.on('data', handleData);
    this.#disconnected$.subscribe(() => {
      this.#isReady = false;
      conn.off('open', handleOpen);
      conn.off('close', handleClose);
      conn.off('data', handleData);
    });

    /**
     * Mark this channel as ready after 100ms, at this point there
     * must be something weird going on at the other end to cause us
     * to receive no response.
     */
    Time.delay(100, () => this.#setAsReady());
  }

  disconnect() {
    this.#disconnected$.next();
  }

  send(message: RepoMessage) {
    if (!this.#conn) throw new Error('Connection not ready');
    if ('data' in message) {
      this.#transmit({ ...message, data: toUint8Array(message.data) });
    } else {
      this.#transmit(message);
    }
  }

  #transmit(message: t.WebrtcMessage) {
    if (!this.#conn) throw new Error('Connection not ready');
    this.#conn.send(message);
    this.#alert('outgoing', message);
  }

  #alert(direction: t.PeerConnectDirection, message: t.WebrtcMessage) {
    this.#message$.next({ direction, message });
  }

  #setAsReady() {
    if (this.#isReady) return;
    this.#isReady = true;
    this.emit('ready', { network: this });
  }

  #announceConnection(peerId: PeerId) {
    this.#setAsReady();
    this.emit('peer-candidate', { peerId });
  }
}

/**
 * Helpers
 */
function toUint8Array(input: ArrayBufferLike): Uint8Array {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}
