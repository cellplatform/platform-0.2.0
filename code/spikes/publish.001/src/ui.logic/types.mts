import * as t from '../common/types.mjs';

export * from './StateBus/types.mjs';

type UrlString = string;

/**
 * State Tree
 */
export type StateTree = {
  outline?: StateMarkdown;
  selected?: UrlString;
};

export type StateMarkdown = { markdown: string; info: t.MarkdownInfo };
