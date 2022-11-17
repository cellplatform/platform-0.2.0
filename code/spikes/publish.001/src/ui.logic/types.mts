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
  env: StateEnvironment;
  location?: StateLocation;
  markdown?: StateMarkdown;
  selection: StateSelection;
  log?: t.PublicLogSummary;
  overlay?: StateOverlay;
};

export type StateMarkdown = { outline?: MdString; document?: MdString };
export type StateLocation = { url: DirPath };

export type StateSelection = {
  index?: { path: DirPath };
};

export type StateEnvironment = {
  media: { muted?: boolean };
};

/**
 * Popup overlay
 */
export type StateOverlay = {
  tx: Id;
  def: t.OverlayDef;
  content?: StateOverlayContent;
  error?: string;
};

export type StateOverlayContent = { md: t.ProcessedMdast };

export type OverlayDef = {
  title?: string;
  detail?: string;
  margin?: { top?: number; bottom?: number };
  source: IndexPath;
};

/**
 * Subset of the state that is persisted to local-storage.
 */
export type LocalStorageState = {
  selection: t.StateSelection;
  env: StateEnvironment;
};
