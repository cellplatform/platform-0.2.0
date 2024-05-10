import type { t } from './common';

export type MarkdownInput = string | Uint8Array | undefined;

export type MarkdownProcessor = {
  toMarkdown(input: MarkdownInput, options?: MarkdownProcessorOptions): Promise<ProcessedMdast>;
  toHtml(input: MarkdownInput, options?: HtmlOptions): Promise<ProcessedHast>;
};

export type MarkdownProcessorFactory = (options?: MarkdownProcessorOptions) => t.MarkdownProcessor;

/**
 * Options for a markdown converter.
 */
export type MarkdownProcessorOptions = {
  gfm?: boolean;

  /**
   * Visit each HTML element AFTER processing from MARKDOWN
   * as the final step prior to "stringifying" to text.
   */
  mdast?: (fn: t.MutateMdast) => void;

  /**
   * Flag that adjust external URL links to (safely) open in a new tab.
   * Default: true
   */
  externalLinksInNewTab?: boolean;
};

export type HtmlOptions = MarkdownProcessorOptions & {
  /**
   * Visit each HTML element AFTER processing from MARKDOWN
   * as the final step prior to "stringifying" to text.
   */
  hast?: (fn: t.MutateHast) => void;
};

/**
 * Processed responses.
 */
export type ProcessedMdast = {
  readonly info: t.MarkdownInfo;
  readonly markdown: string;
  readonly mdast: t.MdastRoot;
  toString(position?: t.AstPosition): string;
};

export type ProcessedHast = {
  readonly info: t.MarkdownHtmlInfo;
  readonly html: string;
  readonly markdown: string;
  readonly mdast: t.MdastRoot;
  readonly hast: t.HastRoot;
  toString(position?: t.AstPosition): string;
};
