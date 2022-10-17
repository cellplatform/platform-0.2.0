import { VFileCompatible } from 'vfile';
import type { Code as MdastCode } from 'mdast';
import type { Element as HastElement } from 'hast';

export type TextProcessor = {
  md(options?: MarkdownOptions): MarkdownProcessor;
};

export type MarkdownProcessor = {
  html(input: VFileCompatible, options?: HtmlOptions): Promise<MarkdownProcessorHtml>;
  markdown(input: VFileCompatible, options?: MarkdownOptions): Promise<MarkdownProcessorMd>;
};

export type MarkdownProcessorHtml = {
  readonly text: string;
  readonly info: MarkdownInfo;
};

export type MarkdownProcessorMd = {
  readonly text: string;
  readonly info: MarkdownInfo;
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
