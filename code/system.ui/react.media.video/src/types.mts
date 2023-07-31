import { type t } from './common';

export type * from './ui/ui.Info/types.mjs';
export type * from './ui/ui.VideoPlayer/types.mjs';

/**
 * Common Video resource definition
 */
export type VideoId = string;
export type VideoKind = VideoDef['kind'];
export type VideoDef = VideoDefVimeo | VideoDefYouTube | VideoDefUnknown;

export type VideoDefVimeo = { kind: 'Vimeo'; id: VideoId };
export type VideoDefYouTube = { kind: 'YouTube'; id: VideoId };
export type VideoDefUnknown = { kind: 'Unknown'; id: '' };

/**
 * Common status of a playing video.
 */
export type VideoStatus = {
  secs: { total: t.Seconds; current: t.Seconds; buffered: t.Seconds };
  percent: { complete: t.Percent; buffered: t.Percent };
  is: { playing: boolean; complete: boolean; buffering: boolean };
};
