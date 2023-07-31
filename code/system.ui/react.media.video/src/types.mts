import { type t } from './common';

export type * from './ui/ui.Info/types.mjs';
export type * from './ui/ui.VideoPlayer/types.mjs';

/**
 * Common Video resource definition
 */
export type VideoId = string;
export type VideoKind = VideoSrc['kind'];
export type VideoSrc = VideoSrcVimeo | VideoSrcYouTube | VideoSrcUnknown;

export type VideoSrcVimeo = { kind: 'Vimeo'; id: VideoId };
export type VideoSrcYouTube = { kind: 'YouTube'; id: VideoId };
export type VideoSrcUnknown = { kind: 'Unknown'; id: '' };

/**
 * Common status of a playing video.
 */
export type VideoStatus = {
  secs: { total: t.Seconds; current: t.Seconds; buffered: t.Seconds };
  percent: { complete: t.Percent; buffered: t.Percent };
  is: { playing: boolean; complete: boolean; buffering: boolean };
};
