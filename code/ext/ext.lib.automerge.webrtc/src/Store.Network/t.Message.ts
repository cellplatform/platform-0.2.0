import type { t } from './common';

/**
 * Based on:
 *    MessageChannelNetworkAdapter
 *    https://github.com/automerge/automerge-repo/blob/main/packages/automerge-repo-network-messagechannel/src/index.ts
 */
export type WebrtcMessage = t.ArriveMessage | t.WelcomeMessage | t.AutomergeMessage;
export type WebrtcMessageAlert = {
  direction: t.IODirection;
  message: WebrtcMessage;
};

/**
 * Describes a peer intent to the system
 * storageId: the key for syncState to decide what the other peer already has
 * isEphemeral: to decide if we bother recording this peer's sync state
 */
export interface PeerMetadata {
  storageId?: t.AutomergeStorageId;
  isEphemeral?: boolean;
}

/**
 * Notify the network that we have arrived so everyone knows our peer ID
 */
export type ArriveMessage = {
  type: 'arrive';

  /** The peer ID of the sender of this message */
  senderId: t.AutomergePeerId;

  /** Arrive messages don't have a targetId */
  targetId?: never;

  /** The peer metadata of the sender of this message */
  peerMetadata: PeerMetadata;
};

/**
 * Respond to an arriving peer with our peer ID
 */
export type WelcomeMessage = {
  type: 'welcome';

  /** The peer ID of the recipient sender this message */
  senderId: t.AutomergePeerId;

  /** The peer ID of the recipient of this message */
  targetId: t.AutomergePeerId;

  /** The peer metadata of the sender of this message */
  peerMetadata: PeerMetadata;
};
