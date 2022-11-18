type Seconds = number;

export type DocDiagram = {
  kind: 'doc.diagram'; // Used in markdown, eg: ```yaml doc.diagram
  video: number;
  media: DocDiagramMedia[];
};

export type DocDiagramMedia = DocDiagramMarkdown | DocDiagramImage;
export type DocDiagramMediaType = DocDiagramMarkdownType | DocDiagramImageType;
export type DocDiagramMediaKind = DocDiagramMediaType['kind'];

export type DocTimeWindow = { start?: Seconds | null; end?: Seconds | null };

export type DocDiagramMarkdownType = DocTimeWindow & { kind: 'media.markdown'; indexRef: number };
export type DocDiagramMarkdown = DocTimeWindow & {
  markdown: string;
  title?: string;
};

export type DocDiagramImageType = DocTimeWindow & { kind: 'media.image'; indexRef: number };
export type DocDiagramImage = DocTimeWindow & {
  image: string;
  title?: string;
};
