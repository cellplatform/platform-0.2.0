import { t } from './common';

export type MediaStreamEvent =
  | MediaStreamStatusReqEvent
  | MediaStreamStatusResEvent
  | MediaStreamStartEvent
  | MediaStreamStartedEvent
  | MediaStreamStopEvent
  | MediaStreamStoppedEvent
  | MediaStreamErrorEvent;

/**
 * Fires to retrieve the status of a media stream.
 */
export type MediaStreamStatusReqEvent = {
  type: 'MediaStream/status:req';
  payload: MediaStreamStatusReq;
};
export type MediaStreamStatusReq = { ref: string };

/**
 * Fires to retrieve the status of a media stream.
 */
export type MediaStreamStatusResEvent = {
  type: 'MediaStream/status:res';
  payload: MediaStreamStatusRes;
};
export type MediaStreamStatusRes = {
  ref: string;
  stream?: t.MediaStreamStatus;
};

/**
 * Fires to start a [MediaStream].
 */
export type MediaStreamStartEvent = {
  type: 'MediaStream/start';
  payload: MediaStreamStart;
};
export type MediaStreamStart = {
  ref: string; // ID of the requester.
  kind: 'video' | 'screen';
  constraints?: t.PartialDeep<MediaStreamConstraints>;
  tx?: string;
};

/**
 * Fires when a [MediaStream] has started.
 */
export type MediaStreamStartedEvent = {
  type: 'MediaStream/started';
  payload: MediaStreamStarted;
};
export type MediaStreamStarted = { ref: string; tx: string; stream: MediaStream };

/**
 * Fires to stop a MediaStream.
 */
export type MediaStreamStopEvent = {
  type: 'MediaStream/stop';
  payload: MediaStreamStop;
};
export type MediaStreamStop = { ref: string };

/**
 * Fires to [MediaStream] has stropped.
 */
export type MediaStreamStoppedEvent = {
  type: 'MediaStream/stopped';
  payload: MediaStreamStopped;
};
export type MediaStreamStopped = { ref: string; tracks: t.MediaStreamTrack[] };

/**
 * Fires when an error occurs during recording.
 */
export type MediaStreamErrorEvent = {
  type: 'MediaStream/error';
  payload: MediaStreamError;
};
export type MediaStreamError = {
  ref: string;
  kind: 'stream:error' | 'record:error';
  error: string;
};
