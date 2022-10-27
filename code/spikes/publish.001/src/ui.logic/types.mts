import * as t from '../common/types.mjs';

export * from './StateBus/types.mjs';

/**
 * State Tree
 */
export type State = {
  ast?: t.MdastRoot;
};

export type StateMarkdown = {
  markdown: string;
  info: t.MarkdownInfo;
};
