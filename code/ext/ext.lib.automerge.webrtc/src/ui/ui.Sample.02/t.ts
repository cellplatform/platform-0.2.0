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
export type SampleSharedMain = { module?: SampleModuleDef };
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
  module?: SampleModuleDef;
  edge: { Left: SampleEdgeLayout; Right: SampleEdgeLayout };
};

/**
 * Dynamic Loader (factory)
 */
export type SampleName =
  | 'CodeEditor'
  | 'CodeEditor.AI'
  | 'DiagramEditor'
  | 'Deno.Deploy'
  | 'ModuleNamespace'
  | 'FaceAPI';

export type SampleFactoryCtx = {
  docuri: string;
  store: t.Store;
  accessToken?: string;
  stream?: MediaStream;
};

export type SampleModuleDef = { name: SampleName; docuri: string; target: SampleModuleDefTarget };
export type SampleModuleDefTarget = 'dev:header' | 'main';
