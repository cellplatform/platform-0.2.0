import { type t } from './common';

export type * from './ui/ui.Info/types.mjs';
export type * from './ui/ui.PlayBar/types.mjs';
export type * from './ui/ui.ScreenLayout/types.mjs';

export type * from './ui/ui.VideoDiagram__/types.mjs';
export type * from './ui/ui.VideoLayout__/types.mjs';

type Id = string;
type Url = string;
type VideoId = number;

/**
 * Slug
 */
export type ConceptSlug = {
  id: Id;
  title?: string;
  video?: t.ConceptSlugVideo___;
  image?: t.ConceptSlugImage__;
  download?: t.DownloadFileProps;
};

export type ConceptSlugVideo___ = {
  id?: VideoId; // Video-identifier (eg. 499921561 on vimeo).
  position?: t.EdgePositionInput;
  scale?: t.Percent;
  height?: number;
};

export type ConceptSlugImage__ = {
  src?: Url;
  sizing?: t.ImageSizeStrategy;
};

/**
 * TODO 🐷
 */
/**
 * Time.
 */
// export type VideoTimestamp = {
//   start: t.Seconds;
//   end?: t.Seconds;
//   content: Id[] | VideoTimestampContentRef[];
// };
//
// export type VideoTimestampContentRef<P extends O = O> = {
//   id: Id;
//   props?: P;
// };
