import { t } from './common.mjs';

type O = Record<string, unknown>;
type DocumentId = string;
type InstanceId = string;

export type CrdtRefEvent =
  | CrdtRefReqEvent
  | CrdtRefResEvent
  | CrdtRefRemoveEvent
  | CrdtRefRemovedEvent
  | CrdtRefExistsReqEvent
  | CrdtRefExistsResEvent
  | CrdtRefChangedEvent;

/**
 * Refs: retrieve/change CRDT document.
 */
export type CrdtRefReqEvent<T extends O = O> = {
  type: 'sys.crdt/ref:req';
  payload: CrdtRefReq<T>;
};
export type CrdtRefReq<T extends O = O> = {
  tx: string;
  id: InstanceId;
  doc: { id: DocumentId };
  load?: t.CrdtSaveCtx;
  change?: T | t.CrdtChangeHandler<T>;
  save?: t.CrdtSaveCtx;
};

export type CrdtRefResEvent<T extends O = O> = {
  type: 'sys.crdt/ref:res';
  payload: CrdtRefRes<T>;
};
export type CrdtRefRes<T extends O = O> = {
  tx: string;
  id: InstanceId;
  exists: boolean;
  created: boolean;
  loaded: boolean;
  changed: boolean;
  saved: boolean;
  doc: { id: DocumentId; data?: T };
  error?: string;
};

/**
 * Refs: signals a document reference was initialized.
 */
export type CrdtRefCreated<T extends O = O> = {
  id: InstanceId;
  doc: { id: DocumentId; data: T };
};

/**
 * Refs: remove
 */
export type CrdtRefRemoveEvent = {
  type: 'sys.crdt/ref/remove';
  payload: CrdtRefRemove;
};
export type CrdtRefRemove = { id: InstanceId; doc: { id: DocumentId } };

export type CrdtRefRemovedEvent = {
  type: 'sys.crdt/ref/removed';
  payload: CrdtRefRemoved;
};
export type CrdtRefRemoved = { id: InstanceId; doc: { id: DocumentId } };

/**
 * Refs: exists
 */
export type CrdtRefExistsReqEvent = {
  type: 'sys.crdt/ref/exists:req';
  payload: CrdtRefExistsReq;
};
export type CrdtRefExistsReq = { tx: string; id: InstanceId; doc: { id: DocumentId } };

export type CrdtRefExistsResEvent = {
  type: 'sys.crdt/ref/exists:res';
  payload: CrdtRefExistsRes;
};
export type CrdtRefExistsRes = {
  tx: string;
  id: InstanceId;
  doc: { id: DocumentId };
  exists: boolean;
  error?: string;
};

/**
 * Ref: document changed.
 */
export type CrdtRefChangedEvent<T extends O = O> = {
  type: 'sys.crdt/ref/changed';
  payload: CrdtRefChanged<T>;
};
export type CrdtRefChanged<T extends O = O> = {
  tx: string;
  id: InstanceId;
  doc: { id: DocumentId; prev: T; next: T };
};
