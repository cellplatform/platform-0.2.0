import * as t from '../common/types.mjs';
export * from './StateBus/types.mjs';

type Id = string;
type IndexPath = string;
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
  overlay?: { tx: Id; def: t.OverlayDef };
};

export type StateMarkdown = { outline?: MdString; document?: MdString };
export type StateLocation = { url: DirPath };

export type StateSelection = {
  index?: { path: DirPath };
  editorPath?: string;
};

/**
 * Popup overlay
 */
export type OverlayDef = {
  source: IndexPath;
  title?: string;
  detail?: string;
  margin?: { top?: number; bottom?: number };
};
