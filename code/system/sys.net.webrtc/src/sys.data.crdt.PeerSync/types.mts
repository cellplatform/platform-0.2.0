type Id = string;

/**
 * [Events]
 */
export type CrdtEvent = CrdtSyncEvent;

export type CrdtSyncEvent = {
  type: 'sys.crdt/sync';
  payload: CrdtSync;
};
export type CrdtSync = { tx: Id; message: Uint8Array };
