import type { Message, PeerId } from '@automerge/automerge-repo';

/**
 * Based on:
 *    MessageChannelNetworkAdapter
 *    https://github.com/automerge/automerge-repo/blob/main/packages/automerge-repo-network-messagechannel/src/index.ts
 */
export type WebrtcMessage = ArriveMessage | WelcomeMessage | Message;

/**
 * Notify the network that we have arrived so everyone knows our peer ID
 */
export type ArriveMessage = {
  type: 'arrive';

  /** The peer ID of the sender of this message */
  senderId: PeerId;

  /** Arrive messages don't have a targetId */
  targetId?: never;
};

/**
 * Respond to an arriving peer with our peer ID
 */
export type WelcomeMessage = {
  type: 'welcome';

  /** The peer ID of the recipient sender this message */
  senderId: PeerId;

  /** The peer ID of the recipient of this message */
  targetId: PeerId;
};
