import { t } from './common';

export type MediaStreamsEvent = t.MediaStreamsStatusReqEvent | t.MediaStreamsStatusResEvent;

/**
 * PLURAL Fires to retrieve the status of all streams.
 */
export type MediaStreamsStatusReqEvent = {
  type: 'MediaStreams/status:req';
  payload: MediaStreamsStatusReq;
};
export type MediaStreamsStatusReq = { kind?: t.MediaStreamKind };

/**
 * PLURAL Fires to retrieve the status of all streams.
 */
export type MediaStreamsStatusResEvent = {
  type: 'MediaStreams/status:res';
  payload: MediaStreamsStatusRes;
};
export type MediaStreamsStatusRes = { streams: t.MediaStreamStatus[] };
