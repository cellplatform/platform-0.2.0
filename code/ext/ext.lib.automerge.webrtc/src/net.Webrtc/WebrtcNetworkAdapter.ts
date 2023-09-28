import {
  Message,
  NetworkAdapter,
  NetworkAdapterMessage,
  type PeerId,
} from '@automerge/automerge-repo';
import type { DataConnection, Peer } from 'peerjs';
import { Time } from '../common';

/**
 * An Automerge repo network-adapter for WebRTC (P2P)
 *
 * Based on:
 *    MessageChannelNetworkAdapter (point-to-point)
 *    https://github.com/automerge/automerge-repo/blob/main/packages/automerge-repo-network-messagechannel/src/index.ts
 */
export class WebrtcNetworkAdapter extends NetworkAdapter {
  #peer: Peer;
  #conn: DataConnection | undefined;
  #remoteId: string | undefined;
  #isReady = false;

  constructor(peer: Peer, remoteId?: string) {
    super();
    this.#peer = peer;
    this.#remoteId = remoteId;
  }

  connect(peerId: PeerId) {
    this.peerId = peerId;

    const setupConnection = (conn: DataConnection) => {
      this.#conn = conn;

      conn.on('open', () => conn.send({ type: 'arrive', senderId: this.peerId }));
      conn.on('close', () => this.emit('close'));
      conn.on('data', (data) => {
        const message = data as NetworkAdapterMessage;
        const { type, senderId } = message;

        switch (type) {
          case 'arrive':
            conn.send({
              type: 'welcome',
              senderId: this.peerId,
              targetId: senderId,
            });
            this.#announceConnection(senderId);
            break;

          case 'welcome':
            this.#announceConnection(senderId);
            break;

          default:
            if ('data' in message) {
              this.emit('message', { ...message, data: toUint8Array(message.data) });
            } else {
              this.emit('message', message);
            }
            break;
        }
      });

      /**
       * Mark this channel as ready after 100ms, at this point there
       * must be something weird going on on the other end to cause us
       * to receive no response.
       */
      Time.delay(100, () => this.#setAsReady());
    };

    this.#peer.on('connection', (conn) => setupConnection(conn));
    if (this.#remoteId) {
      // If the remote-id is known start the connection now.
      setupConnection(this.#peer.connect(this.#remoteId));
    }
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

  send(message: Message) {
    const conn = this.#conn;
    if (!conn) throw new Error('Connection not ready');

    if ('data' in message) {
      conn.send({ ...message, data: toUint8Array(message.data) });
    } else {
      conn.send(message);
    }
  }

  disconnect() {
    this.#peer.disconnect();
  }
}

/**
 * Helpers
 */
function toUint8Array(input: ArrayBufferLike): Uint8Array {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}
