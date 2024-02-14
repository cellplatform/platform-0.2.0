export type * from '../common/t';
import type { t } from './common';

type S = string;

export type SampleEdge = {
  kind: t.NetworkConnectionEdgeKind;
  model: t.RepoListModel;
  network: t.NetworkStore;
  visible?: boolean;
};

/**
 * Sample: <Component>
 */
export type SampleEdgeProps = {
  edge: t.SampleEdge;
  offsetLabel?: t.SampleEdgeLabel;
  focusOnLoad?: boolean;
  style?: t.CssValue;
  onStreamSelection?: t.PeerStreamSelectionHandler;
};

export type SampleEdgeLabel = { text: string; absolute?: t.CssEdgesInput };
export type SampleEdgeLayout = {
  visible: boolean;
  showJson: boolean;
  fields?: t.InfoField[];
};
export type SampleSharedMain = { module?: SampleLoaderDef };
export type SampleSharedCmdHost = SampleSharedMain & {
  filter?: string;
  address?: string;
  selectedIndex?: number;
};

/**
 * Sample: DevHarness
 */
export type HarnessShared = {
  debugPanel: boolean;
  module?: SampleLoaderDef;
  edge: { Left: SampleEdgeLayout; Right: SampleEdgeLayout };
};

/**
 * Dynamic Loader (factory)
 */
export type SampleTypename = 'CodeEditor' | 'DiagramEditor' | 'Auth' | 'ModuleNamespace';
export type SampleFactoryCtx = {
  docuri: string;
  store: t.Store;
};

// TEMP 🐷
export type SampleLoaderDef = { typename: SampleTypename; docuri: string; target?: string };
