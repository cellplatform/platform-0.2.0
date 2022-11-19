import * as t from '../common/types.mjs';

type Seconds = number;

export type DocDiagram = {
  kind: 'doc.diagram'; // Used in markdown, eg: ```yaml doc.diagram
  video: DocDiagramVideoSource; // TODO 🐷 support [array] also
  media: DocDiagramMedia[];
};

export type DocDiagramVideoSource = t.VimeoId;

export type DocDiagramMedia = DocDiagramMarkdown | DocDiagramImage;
export type DocDiagramMediaType = DocDiagramMarkdownType | DocDiagramImageType;
export type DocDiagramMediaKind = DocDiagramMediaType['kind'];

export type DocTimeWindow = { start?: Seconds | null; end?: Seconds | null };

export type DocDiagramMarkdownType = DocTimeWindow & { kind: 'media.markdown'; indexRef: number };
export type DocDiagramMarkdown = DocTimeWindow & {
  title?: string;
  markdown: string;
};

export type DocDiagramImageType = DocTimeWindow & { kind: 'media.image'; indexRef: number };
export type DocDiagramImage = DocTimeWindow & {
  title?: string;
  image: string;
};
