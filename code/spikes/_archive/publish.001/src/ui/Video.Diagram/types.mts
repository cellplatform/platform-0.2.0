import type { t } from '../common.t';

type Seconds = number;
type MarkdownString = string;

export type DocDiagram = {
  kind: 'doc.diagram'; // Used in markdown, eg: ```yaml doc.diagram
  video: DocDiagramVideoSource; // TODO 🐷 support [array] also
  media: DocDiagramMedia[];
};

export type DocDiagramVideoSource = t.VimeoId;

export type DocDiagramMedia = DocDiagramMarkdown | DocDiagramImage;
export type DocDiagramMediaTimeRef = DocDiagramMarkdownTimeRef | DocDiagramImageTimeRef;
export type DocDiagramMediaType = DocDiagramMarkdownType | DocDiagramImageType;

export type DocDiagramMediaKind = DocDiagramMediaTimeRef['kind'];

export type DocTimeWindow = { start?: Seconds | null; end?: Seconds | null };

/**
 * Markdown
 */
export type DocDiagramMarkdownType = DocDiagramMarkdown & { kind: 'media.markdown' };
export type DocDiagramMarkdown = DocTimeWindow & {
  markdown: MarkdownString;
  title?: string;
  refs?: MarkdownString;
};
export type DocDiagramMarkdownTimeRef = DocTimeWindow & {
  kind: 'media.markdown';
  indexRef: number;
};

/**
 * Image
 */
export type DocDiagramImageType = DocDiagramImage & { kind: 'media.image' };
export type DocDiagramImage = DocTimeWindow & {
  image: string;
};
export type DocDiagramImageTimeRef = DocTimeWindow & {
  kind: 'media.image';
  indexRef: number;
};
