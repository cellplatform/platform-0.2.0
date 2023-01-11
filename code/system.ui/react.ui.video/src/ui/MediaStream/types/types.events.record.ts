import { t } from './common';

export type MediaStreamRecordOnData = (e: MediaStreamRecordOnDataArgs) => void;
export type MediaStreamRecordOnDataArgs = {
  mimetype: string;
  bytes: number;
  blob: Blob;
  toUint8Array(blob: Blob): Promise<Uint8Array>;
};

/**
 * EVENTS
 */
export type MediaStreamRecordEvent =
  | MediaStreamRecordStatusReqEvent
  | MediaStreamRecordStatusResEvent
  | MediaStreamRecordStartEvent
  | MediaStreamRecordStartedEvent
  | MediaStreamRecordInterruptEvent
  | MediaStreamRecordInterruptedEvent
  | MediaStreamRecordStopEvent
  | MediaStreamRecordStoppedEvent;

/**
 * Status of a recording.
 */
export type MediaStreamRecordStatusReqEvent = {
  type: 'MediaStream/record/status:req';
  payload: MediaStreamRecordStatusReq;
};
export type MediaStreamRecordStatusReq = { ref: string; tx: string };

export type MediaStreamRecordStatusResEvent = {
  type: 'MediaStream/record/status:res';
  payload: MediaStreamRecordStatusRes;
};
export type MediaStreamRecordStatusRes = {
  ref: string;
  tx: string;
  status?: t.MediaStreamRecordStatus;
};

/**
 * Starts recording a stream.
 */
export type MediaStreamRecordStartEvent = {
  type: 'MediaStream/record/start';
  payload: MediaStreamRecordStart;
};
export type MediaStreamRecordStart = { ref: string; mimetype?: t.MediaStreamMimetype };

export type MediaStreamRecordStartedEvent = {
  type: 'MediaStream/record/started';
  payload: MediaStreamRecordStarteded;
};
export type MediaStreamRecordStarteded = MediaStreamRecordStart;

/**
 * Apply an action to the recording: pause/resume
 */
export type MediaStreamRecordInterruptEvent = {
  type: 'MediaStream/record/interrupt';
  payload: MediaStreamRecordInterrupt;
};
export type MediaStreamRecordInterrupt = { ref: string; action: MediaStreamRecordInterruptAction };
export type MediaStreamRecordInterruptAction = 'pause' | 'resume';

export type MediaStreamRecordInterruptedEvent = {
  type: 'MediaStream/record/interrupted';
  payload: MediaStreamRecordInterrupted;
};
export type MediaStreamRecordInterrupted = MediaStreamRecordInterrupt;

/**
 * Stops the recording of a stream.
 */
export type MediaStreamRecordStopEvent = {
  type: 'MediaStream/record/stop';
  payload: MediaStreamRecordStop;
};
export type MediaStreamRecordStop = {
  ref: string;
  download?: { filename: string };
  onData?: MediaStreamRecordOnData;
};

/**
 * Fires when a recording is stopped.
 */
export type MediaStreamRecordStoppedEvent = {
  type: 'MediaStream/record/stopped';
  payload: MediaStreamRecordStopped;
};
export type MediaStreamRecordStopped = { ref: string; file: Blob };
