import type { Code as MdastCode } from 'mdast';
import type { Element as HastElement } from 'hast';

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
