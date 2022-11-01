import { t } from './common.mjs';

export type MarkdownInput = string | Uint8Array | undefined;

export type MarkdownProcessor = {
  toMarkdown(input: MarkdownInput, options?: MarkdownOptions): Promise<ProcessedMdast>;
  toHtml(input: MarkdownInput, options?: HtmlOptions): Promise<ProcessedHast>;
};

export type ProcessedMdast = {
  readonly info: MarkdownInfo;
  readonly markdown: string;
  toString(options?: ProcessedMdastStringOptions): string;
};
export type ProcessedMdastStringOptions = {
  kind?: 'md';
  position?: t.AstPosition;
};

export type ProcessedHast = {
  readonly info: MarkdownHtmlInfo;
  readonly html: string;
  readonly markdown: string;
  toString(options?: ProcessedHastStringOptions): string;
};
export type ProcessedHastStringOptions = {
  kind?: 'html' | 'md';
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

/**
 * Derived information about the structure of some markdown
 * resulting from the markdown text-processor running.
 */
export type MarkdownInfo = {
  mdast: t.MdastRoot;
  code: t.CodeInfo;
};
export type MarkdownHtmlInfo = MarkdownInfo & { hast: t.HastRoot };
