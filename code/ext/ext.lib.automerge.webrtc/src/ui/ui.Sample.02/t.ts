export type * from '../common/t';
import type { t } from './common';

export type * from '../ui.Sample.02.loaders/t';

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
  cmdbar?: string;
};

export type SampleModuleDef = {
  name: t.SampleName;
  docuri: string;
  target: t.SampleModuleDefTarget;
};
export type SampleModuleDefTarget = 'dev:header' | 'main';
