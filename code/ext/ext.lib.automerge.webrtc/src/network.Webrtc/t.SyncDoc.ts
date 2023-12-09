import type { t } from './common';

/**
 * An ephemeral document for the purposes of synchonizing
 * state and configuration between connected peers.
 */
export type WebrtcSyncDoc = t.DocWithMeta & {
  peers: WebrtcSyncDocPeers;
  shared: WebrtcSyncDocShared;
};

/**
 * Map of connected peers.
 */
export type WebrtcSyncDocPeers = { [peerid: string]: WebrtcSyncDocPeer };
export type WebrtcSyncDocPeer = { ua: t.UserAgent };

/**
 * Map of shared documents.
 */
export type WebrtcSyncDocShared = { [uri: string]: boolean };
