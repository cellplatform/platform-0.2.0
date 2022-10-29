import * as t from '../common/types.mjs';
export * from './StateBus/types.mjs';

type UrlString = string;
type MdString = string;

/**
 * State Tree
 */
export type StateTree = {
  location?: StateLocation;
  markdown?: StateMarkdown;
  selected?: StateSelection;
  log?: t.PublicLogSummary;
};

export type StateMarkdown = { outline?: MdString; document?: MdString };

export type StateLocation = {
  url: UrlString;
};

export type StateSelection = {
  url: UrlString;
};
