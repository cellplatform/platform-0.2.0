import type { Code as MdastCode } from 'mdast';
import type { Element as HastElement } from 'hast';

export type MarkdownInput = string | Uint8Array | undefined;

export type MarkdownProcessor = {
  toMarkdown(input: MarkdownInput, options?: MarkdownOptions): Promise<MarkdownProcessorMd>;
  toHtml(input: MarkdownInput, options?: HtmlOptions): Promise<MarkdownProcessorHtml>;
};

export type MarkdownProcessorMd = {
  readonly info: MarkdownInfo;
  readonly markdown: string;
  toString(): string;
};

export type MarkdownProcessorHtml = {
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
  type: string;
  text: string;
};
export type CodeMatch = (e: CodeMatchArgs) => void;
export type CodeMatchArgs = {
  node: MdastCode;
  replace(node: HastElement): void;
};

/**
 * Options for a markdown converter.
 */
export type MarkdownOptions = {
  gfm?: boolean;
};

export type HtmlOptions = MarkdownOptions & {
  //
};

export type MarkdownInfo = {
  codeblocks: CodeBlock[];
};
