import * as t from '../common/types.mjs';
import { CrdtRefEvent } from './types.Event.Ref.mjs';

type InstanceId = string;

/**
 * EVENTS
 */
export type CrdtEvent = CrdtInfoReqEvent | CrdtInfoResEvent | CrdtRefEvent;

/**
 * Module info.
 */
export type CrdtInfoReqEvent = {
  type: 'sys.crdt/info:req';
  payload: CrdtInfoReq;
};
export type CrdtInfoReq = { tx: string; id: InstanceId };

export type CrdtInfoResEvent = {
  type: 'sys.crdt/info:res';
  payload: CrdtInfoRes;
};
export type CrdtInfoRes = { tx: string; id: InstanceId; info?: t.CrdtInfo; error?: string };
