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

export type SampleFactoryTypename =
  | 'CodeEditor'
  | 'DiagramEditor'
  | 'Auth'
  | 'CmdHost'
  | 'ModuleNamespace';
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
  module?: SampleLoaderDef<SampleFactoryTypename>;
  edge: { Left: SampleEdgeLayout; Right: SampleEdgeLayout };
};

/**
 * Dynamic Loading
 */
export type SampleLoaderDef<T extends S = S> = { typename: T; docuri: string; target?: string };
export type SampleLoadFactory<T extends S = S> = (
  e: SampleLoadFactoryArgs<T>,
) => Promise<JSX.Element | void>;
export type SampleLoadFactoryArgs<T extends S = S> = SampleLoaderDef<T> & {
  store: t.Store;
  shared: t.Lens<{ module?: SampleLoaderDef<T> }>;
};
