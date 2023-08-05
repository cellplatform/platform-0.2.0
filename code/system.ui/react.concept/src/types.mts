import { type t } from './common';

export type * from './ui/-sys.common.Layout.Split/types.mjs';

export type * from './ui/ui.Empty/types.mjs';
export type * from './ui/ui.Info/types.mjs';
export type * from './ui/ui.Layout/types.mjs';
export type * from './ui/ui.VideoDiagram/types.mjs';

export type * from './ui/ui.PlayBar__/types.mjs';

type Id = string;
type Url = string;
type VideoId = number;

/**
 * Slug
 */
export type ConceptSlug__ = {
  id: Id;
  title?: string;
  video?: t.ConceptSlugVideo___;
  image?: t.ConceptSlugImage__;
  download?: t.DownloadFileProps;
};

export type ConceptSlugVideo___ = {
  id?: VideoId;
  position?: t.EdgePositionInput;
  scale?: t.Percent;
  height?: number;
};

export type ConceptSlugImage__ = {
  src?: Url;
  sizing?: t.ImageSizeStrategy;
};
