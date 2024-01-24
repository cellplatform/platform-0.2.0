import type { is } from 'unist-util-is';
import type { t } from '../common';

export type Markdown = {
  processor: t.MarkdownProcessorFactory;
  Is: MarkdownIs;
  Find: MarkdownFind;
};

export type MarkdownIs = {
  node: typeof is;
  image(node?: t.MdastNode): boolean;
};

export type MarkdownFind = {
  image(within?: t.MdastNode): t.MdastImage | undefined;
};
