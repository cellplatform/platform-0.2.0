import type { t } from '../common.t';

type HtmlString = string;

export type MarkdownDocBlockRenderer = (
  e: MarkdownDocBlockRendererArgs,
) => Promise<HtmlString | JSX.Element | null>;

export type MarkdownDocBlockRendererArgs = {
  instance: t.Instance;
  index: number;
  node: t.MdastNode;
  md: t.ProcessedMdast;
};
