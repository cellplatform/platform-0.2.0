import * as t from '../common/types.mjs';

type HtmlString = string;

export type MarkdownDocBlockRenderer = (
  e: MarkdownDocBlockRendererArgs,
) => Promise<HtmlString | JSX.Element | null>;

export type MarkdownDocBlockRendererArgs = {
  instance: t.StateInstance;
  index: number;
  node: t.MdastNode;
  md: t.ProcessedMdast;
};
