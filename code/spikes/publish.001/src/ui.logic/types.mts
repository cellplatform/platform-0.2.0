import * as t from '../common/types.mjs';
export * from './StateBus/types.mjs';

type UrlString = string;

/**
 * State Tree
 */
export type StateTree = {
  location?: StateLocation;
  selected?: UrlString;
  outline?: StateMarkdown;
  log?: t.PublicLogSummary;
};

export type StateMarkdown = { markdown: string; info: t.MarkdownInfo };

export type StateLocation = {
  href: string;
};
