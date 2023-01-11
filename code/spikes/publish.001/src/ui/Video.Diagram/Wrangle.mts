import { type t } from '../common';

export const Wrangle = {
  isImage(media?: t.DocDiagramMedia) {
    const typed = media as t.DocDiagramImage;
    return typeof typed?.image === 'string' || typed?.image === null;
  },
  isMarkdown(media?: t.DocDiagramMedia) {
    const typed = media as t.DocDiagramMarkdown;
    return typeof typed?.markdown === 'string' || typed?.markdown === null;
  },
  toKind(media: t.DocDiagramMedia): t.DocDiagramMediaKind | undefined {
    if (Wrangle.isImage(media)) return 'media.image';
    if (Wrangle.isMarkdown(media)) return 'media.markdown';
    return undefined;
  },
};
