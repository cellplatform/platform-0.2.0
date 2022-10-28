import * as t from '../common/types.mjs';

export * from './StateBus/types.mjs';

/**
 * State Tree
 */
export type StateTree = {
  outline?: StateMarkdown;
};

export type StateMarkdown = { markdown: string; info: t.MarkdownInfo };
