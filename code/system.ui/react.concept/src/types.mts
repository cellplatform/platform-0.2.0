import { type t } from './common';

export type * from './ui/ui.Info/types.mjs';
export type * from './ui/ui.PlayBar/types.mjs';
export type * from './ui/ui.VideoDiagram/types.mjs';

type Id = string;
type Url = string;
type VideoId = number;

/**
 * Slug
 */
export type ConceptSlug = {
  id: Id;
  title?: string;
  video?: t.ConceptSlugVideo;
  image?: t.ConceptSlugImage;
  download?: t.DownloadFileProps;
};

export type ConceptSlugVideo = {
  id?: VideoId; // Video-identifier (eg. 499921561 on vimeo).
  position?: t.EdgePositionInput;
  scale?: number;
  height?: number;
};

export type ConceptSlugImage = {
  src?: Url;
  sizing?: t.ImageSizeStrategy;
};
