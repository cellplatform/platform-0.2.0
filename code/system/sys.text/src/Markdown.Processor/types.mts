import * as t from '../common/types.mjs';

export type MarkdownInput = string | Uint8Array | undefined;

export type MarkdownProcessor = {
  toMarkdown(input: MarkdownInput, options?: MarkdownOptions): Promise<MarkdownProcessedMd>;
  toHtml(input: MarkdownInput, options?: HtmlOptions): Promise<MarkdownProcessedHtml>;
};

export type MarkdownProcessedMd = {
  readonly info: MarkdownInfo;
  readonly markdown: string;
  toString(): string;
};

export type MarkdownProcessedHtml = {
  readonly info: MarkdownInfo;
  readonly html: string;
  readonly markdown: string;
  toString(): string;
};

/**
 * Represents a code-block within Markdown.
 */
export type CodeBlock = {
  id: string;
  lang: string;
  type: string; // meta.
  text: string;
};
export type CodeMatch = (e: CodeMatchArgs) => void;
export type CodeMatchArgs = {
  node: t.MdastCode;
  replace(node: t.HastElement): void;
};

/**
 * Options for a markdown converter.
 */
export type MarkdownOptions = {
  gfm?: boolean;
};

export type HtmlOptions = MarkdownOptions & {
  // <<= Any specific HTML rendering hints here.
};

/**
 * Derived information about the structure of some markdown
 * resulting from the markdown text-processor running.
 */
export type MarkdownInfo = {
  root: t.MdastRoot;
  code: {
    all: CodeBlock[];
    typed: CodeBlock[]; //   Code blocks with a "type" meta-data suffix, (eg. ```yaml my.typename).
    untyped: CodeBlock[]; // Code blocks without a "type" meta-data suffix.
  };
};
