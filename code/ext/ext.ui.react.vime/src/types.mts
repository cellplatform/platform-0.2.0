export type * from './ui/Info/types.mjs';
export type * from './ui/VimePlayer/types.mjs';

/**
 * TODO 🐷
 * - rename module to: [sys.ui.video]
 */

export type Video = {
  id: string;
  status: VideoStatus;
};

export type VideoStatus = {
  percent: number;
  secs: { total: number; current: number };
  is: { playing: boolean; ended: boolean };
};
