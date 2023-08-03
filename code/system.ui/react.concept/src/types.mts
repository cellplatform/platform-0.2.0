import { type t } from './common';

export type * from './ui/ui.Info/types.mjs';
export type * from './ui/ui.PlayBar/types.mjs';
export type * from './ui/ui.ScreenLayout/types.mjs';
export type * from './ui/ui.VideoDiagram/types.mjs';
export type * from './ui/ui.VideoLayout/types.mjs';

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
  image?: t.ConceptSlugImage___;
  download?: t.DownloadFileProps;
};

export type ConceptSlugVideo___ = {
  id?: VideoId; // Video-identifier (eg. 499921561 on vimeo).
  position?: t.EdgePositionInput;
  scale?: t.Percent;
  height?: number;
};

export type ConceptSlugImage___ = {
  src?: Url;
  sizing?: t.ImageSizeStrategy;
};

/**
