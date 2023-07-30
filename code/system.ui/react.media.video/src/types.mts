export type * from './ui/ui.Info/types.mjs';
export type * from './ui/ui.VideoPlayer/types.mjs';

export type VideoId = string;
export type VideoKind = VideoDefYouTube['kind'];

/**
 * Common Video resource definition
 */
export type VideoDef = VideoDefVimeo | VideoDefYouTube | VideoDefUnknown;

export type VideoDefVimeo = { kind: 'Vimeo'; id: VideoId };
export type VideoDefYouTube = { kind: 'YouTube'; id: VideoId };
export type VideoDefUnknown = { kind: 'Unknown'; id: '' };

/**
 * Common status of a playing video.
 */
export type VideoStatus = {
  percent: number;
  secs: { total: number; current: number };
  is: { playing: boolean; ended: boolean };
};
