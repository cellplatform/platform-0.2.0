import { type t } from './common';

export type * from './ui/ui.Info/types.mjs';
export type * from './ui/ui.PlayBar/types.mjs';
export type * from './ui/ui.PlayButton/types.mjs';
export type * from './ui/ui.VideoPlayer/types.mjs';

/**
 * Common Video resource definition
 */
export type VideoId = string;
export type VideoAddress = string;
export type VideoKind = VideoSrc['kind'];
export type VideoMimeType = 'video/mp4' | 'video/webm';

export type VideoSrcInput = VideoSrc | string | number;
export type VideoSrc = VideoSrcFile | VideoSrcVimeo | VideoSrcYoutube | VideoSrcUnknown;

export type VideoSrcKind = VideoSrc['kind'];
export type VideoSrcUnknown = { kind: 'Unknown'; ref: '' };
export type VideoSrcVimeo = { kind: 'Vimeo'; ref: VideoId };
export type VideoSrcYoutube = { kind: 'YouTube'; ref: VideoId };
export type VideoSrcFile = { kind: 'Video'; ref: VideoAddress; mimetype: VideoMimeType };

/**
 * Common status of a playing video.
 */
export type VideoStatus = {
  secs: { total: t.Seconds; current: t.Seconds; buffered: t.Seconds };
  percent: { complete: t.Percent; buffered: t.Percent };
  is: {
    playing: boolean;
    complete: boolean;
    buffering: boolean;
    muted: boolean;
  };
};
