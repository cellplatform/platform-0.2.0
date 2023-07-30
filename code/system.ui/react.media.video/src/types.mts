export type * from './ui/ui.Info/types.mjs';
export type * from './ui/ui.VideoPlayer/types.mjs';

export type VideoId = string;

/**
 * Common Video Media Definition
 */
export type Video = {
  id: VideoId;
  status: VideoStatus;
};

export type VideoStatus = {
  percent: number;
  secs: { total: number; current: number };
  is: { playing: boolean; ended: boolean };
};
