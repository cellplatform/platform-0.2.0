import { t } from './common';

export type MediaStreamMimetype = 'video/webm';
export type MediaStreamKind = 'video' | 'screen';

export type MediaStreamStatus = {
  ref: string;
  media: MediaStream;
  kind: t.MediaStreamKind;
  constraints: MediaStreamConstraints;
  tracks: t.MediaStreamTrack[];
  isEnded: boolean;
};

export type MediaStreamTrack = {
  kind: 'audio' | 'video';
  id: string;
  isEnabled: boolean;
  label: string;
  state: 'live' | 'ended';
};

export type MediaStreamRecordStatus = {
  state: 'recording' | 'paused' | 'stopped';
  startedAt: number;
};
