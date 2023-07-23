import { type t } from './common';

type Id = string;
type Url = string;
type VideoId = number;

/**
 * Component
 */
export type ConceptSlugProps = {
  vimeo?: t.VimeoInstance;
  slug?: t.ConceptSlug;
  style?: t.CssValue;
};

/**
 * Slug
 */
export type ConceptSlug = {
  id: Id;
  title?: string;
  video?: t.ConceptSlugVideo;
  image?: t.ConceptSlugImage;
};

export type ConceptSlugVideo = {
  id?: VideoId; // Video-identifier (eg. 499921561 on vimeo).
  position?: t.PositionInput;
  scale?: number;
  height?: number;
};

export type ConceptSlugImage = {
  src?: Url;
  sizing?: t.ImageSizeStrategy;
};
