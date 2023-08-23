import { type t } from './common';

export type * from './ui/ui.Empty/types.mjs';
export type * from './ui/ui.Index/types.mjs';
export type * from './ui/ui.Info/types.mjs';
export type * from './ui/ui.Layout/types.mjs';
export type * from './ui/ui.VideoDiagram/types.mjs';

/**
 * Primary "Slug" concept.
 */
type Id = string;

export type SlugListItem = t.Slug | t.SlugNamespace;
export type SlugNamespace = {
  kind: 'slug:namespace';
  namespace: string;
  title?: string;
};

export type Slug = {
  id: Id;
  kind: 'slug:VideoDiagram';
  title?: string;
  video?: t.SlugVideo;
  split?: t.Percent;
};

export type SlugVideo = {
  src?: t.VideoSrc;
  innerScale?: number;
  timestamps?: t.SlugImage[];
};

export type SlugImage = {
  start?: t.Seconds;
  end?: t.Seconds;
  src?: t.ImageSrc;
  sizing?: t.ImageSizeStrategy; // 'cover' | 'contain';
  scale?: number;
};
