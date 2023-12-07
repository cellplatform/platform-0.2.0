import type { t } from './common';

/**
 * An ephemeral document for the purposes of synchonizing
 * state and configuration between connected peers.
 */
export type WebrtcSyncDoc = t.DocWithMeta & { shared: WebrtcSyncDocShared };
export type WebrtcSyncDocShared = { [uri: string]: boolean };
