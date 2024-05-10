import type { t } from '../../common';

export type MarkdownInput = string | Uint8Array | undefined;

export type MarkdownProcessor = {
  toMarkdown(input: MarkdownInput, options?: MarkdownOptions): Promise<MarkdownProcessedMd>;
  toHtml(input: MarkdownInput, options?: HtmlOptions): Promise<MarkdownProcessedHtml>;
};

export type MarkdownProcessedMd = {
  readonly info: t.MarkdownInfo;
  readonly markdown: string;
  toString(): string;
};

export type MarkdownProcessedHtml = {
  readonly info: t.MarkdownHtmlInfo;
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

  /**
   * Visit each HTML element AFTER processing from MARKDOWN
   * as the final step prior to "stringifying" to text.
   */
  mdast?: (fn: t.MutateMdast) => void;
};

export type HtmlOptions = MarkdownOptions & {
  /**
   * Visit each HTML element AFTER processing from MARKDOWN
   * as the final step prior to "stringifying" to text.
   */
  hast?: (fn: t.MutateHast) => void;
};
