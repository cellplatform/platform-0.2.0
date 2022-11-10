import * as t from '../common/types.mjs';
export * from './StateBus/types.mjs';

type DirPath = string;
type MdString = string;

/**
 * State Tree
 */
export type StateTree = {
  location?: StateLocation;
  markdown?: StateMarkdown;
  selection: StateSelection;
  log?: t.PublicLogSummary;
};

export type StateMarkdown = { outline?: MdString; document?: MdString };

export type StateLocation = {
  url: DirPath;
};

export type StateSelection = {
  index?: { path: DirPath };
  editorPath?: string;
};
