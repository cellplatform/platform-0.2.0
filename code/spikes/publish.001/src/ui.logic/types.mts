import * as t from '../common/types.mjs';

export {};

export type State = {
  ast?: t.MdastRoot;
};

export type StateMarkdown = {
  markdown: string;
  info: t.MarkdownInfo;
};
