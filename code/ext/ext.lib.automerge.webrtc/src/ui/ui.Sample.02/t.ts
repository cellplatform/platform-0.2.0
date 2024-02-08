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
  | 'ModuleLoader';
export type SampleEdgeLabel = { text: string; absolute?: t.CssEdgesInput };
export type SampleEdgeLayout = { visible: boolean };
export type SampleSharedMain = { module?: LoaderDef };
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
  module?: LoaderDef<SampleFactoryTypename>;
  edge: { Left: SampleEdgeLayout; Right: SampleEdgeLayout };
};

/**
 * Dynamic Loading
 */
export type LoaderDef<T extends S = S> = { typename: T; docuri: string; target?: string };
export type LoadFactory<T extends S = S> = (e: LoadFactoryArgs<T>) => Promise<JSX.Element | void>;
export type LoadFactoryArgs<T extends S = S> = LoaderDef<T> & {
  store: t.Store;
  shared: t.Lens<{ module?: LoaderDef<T> }>;
};
