import type { t } from './common';

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

export type CodeInfo = {
  all: CodeBlock[];
  typed: CodeBlock[]; //     Code blocks with a "type" meta-data suffix, (eg. ```yaml my.typename).
  untyped: CodeBlock[]; //   Code blocks without a "type" meta-data suffix.
};
