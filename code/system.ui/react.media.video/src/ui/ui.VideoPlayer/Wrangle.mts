import { type t } from './common';

export const Wrangle = {
  toDef: (kind: t.VideoKind, id: string | number) => ({ kind, id: id.toString() }),
  toYouTube: (id: string): t.VideoDef => Wrangle.toDef('YouTube', id),
  toVimeo: (id: string | number): t.VideoDef => Wrangle.toDef('Vimeo', id),
};
