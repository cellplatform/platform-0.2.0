import type { DataConnection } from 'peerjs';

import { NetworkAdapter, type PeerId, type RepoMessage } from '@automerge/automerge-repo';
import { Time, type t } from '../common';

/**
 * An Automerge repo network-adapter for WebRTC (P2P)
 *
 * Based on:
 *    MessageChannelNetworkAdapter (point-to-point)
 *    https://github.com/automerge/automerge-repo/blob/main/packages/automerge-repo-network-messagechannel/src/index.ts
 */
export class WebrtcNetworkAdapter extends NetworkAdapter {
  #conn: DataConnection;
  #isReady = false;

  constructor(conn: DataConnection) {
    if (!conn) throw new Error(`A peerjs data-connection is required`);
    super();
    this.#conn = conn;
  }

  connect(peerId: PeerId) {
    const senderId = (this.peerId = peerId);
    const conn = this.#conn;
    const send = (message: t.WebrtcMessage) => conn.send(message);

    conn.on('open', () => send({ type: 'arrive', senderId }));
    conn.on('close', () => this.emit('close'));
    conn.on('data', (data) => {
      const message = data as t.WebrtcMessage;
      switch (message.type) {
        case 'arrive':
          send({ type: 'welcome', senderId, targetId: message.senderId });
          this.#announceConnection(message.senderId);
          break;

        case 'welcome':
          this.#announceConnection(message.senderId);
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
     * must be something weird going on at the other end to cause us
     * to receive no response.
     */
    Time.delay(100, () => this.#setAsReady());
  }

  send(message: RepoMessage) {
    const conn = this.#conn;
    if (!conn) throw new Error('Connection not ready');
    if ('data' in message) {
      conn.send({ ...message, data: toUint8Array(message.data) });
    } else {
      conn.send(message);
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
