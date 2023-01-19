import { t } from '../common.t';

export * from './StateBus/types.mjs';

type Tx = string;
type FilePath = string;
type DirPath = string;
type MarkdownString = string;

/**
 * State Tree
 */
export type StateTree = {
  env: StateEnvironment;
  loading: { document?: Tx };
  location?: StateLocation;
  markdown?: StateMarkdown;
  selection: StateSelection;
  log?: t.LogPublicHistory;
  overlay?: StateOverlay;
};

export type StateMarkdown = { outline?: MarkdownString; document?: MarkdownString };
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
  tx: Tx;
  def: t.OverlayDef;
  content?: StateOverlayContent;
  context?: StateOverlayContext[];
  error?: string;
};

export type StateOverlayContent = { md: t.ProcessedMdast; path: FilePath };
export type StateOverlayContext = { title: string; path: FilePath };

export type OverlayDef = {
  title?: string;
  margin?: { top?: number; bottom?: number };
  markdown?: MarkdownString;
  image?: t.DocImageYaml;
  playlist?: t.DocPlaylistYaml;
};

/**
 * Subset of the state that is persisted to local-storage.
 */
export type LocalStorageState = {
  selection: t.StateSelection;
  env: StateEnvironment;
};
