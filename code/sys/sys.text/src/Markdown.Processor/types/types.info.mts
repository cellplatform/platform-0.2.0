import { type t } from './common.mjs';

/**
 * Derived information about the structure of some markdown
 * resulting from the markdown text-processor running.
 */
export type MarkdownInfo = {
  mdast: t.MdastRoot;
  code: t.CodeInfo;
};
export type MarkdownHtmlInfo = MarkdownInfo & { hast: t.HastRoot };
