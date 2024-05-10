type Id = string;

/**
 * [Events]
 */
export type CrdtEvent = CrdtSyncMessageEvent;

/**
 * Fires a CRDT sync-protocol event over the network.
 */
export type CrdtSyncMessageEvent = {
  type: 'sys.crdt/sync';
  payload: CrdtSyncMessage;
};
export type CrdtSyncMessage = {
  tx: Id;
  docid: Id;
  message: Uint8Array | null;
};
