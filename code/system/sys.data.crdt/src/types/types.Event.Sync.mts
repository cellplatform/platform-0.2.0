type DocumentId = string;
type PeerId = string;

export type CrdtSyncEvent = CrdtSyncSendEvent;

/**
 * SYNC: Send changes.
 */
export type CrdtSyncSendEvent = {
  type: 'sys.crdt/sync/send';
  payload: CrdtSyncSend;
};
export type CrdtSyncSend = {
  source: PeerId;
  doc: { id: DocumentId };
  sync: { message: Uint8Array };
};
