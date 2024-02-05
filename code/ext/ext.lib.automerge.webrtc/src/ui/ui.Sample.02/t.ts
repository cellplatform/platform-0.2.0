export * from '../common/t';
import { type t } from './common';

export type SampleEdge = {
  kind: t.NetworkConnectionEdgeKind;
  model: t.RepoListModel;
  network: t.NetworkStore;
  visible?: boolean;
};

/**
 * <Component>
 */
export type SampleEdgeProps = {
  edge: t.SampleEdge;
  offsetLabel?: t.SampleEdgeLabel;
  focusOnLoad?: boolean;
  style?: t.CssValue;
  onStreamSelection?: t.PeerStreamSelectionHandler;
};

export type SampleEdgeLabel = { text: string; absolute?: t.CssEdgesInput };
export type SampleEdgeLayout = { visible: boolean };
export type SampleSharedOverlay = { module?: LoaderDef };

export type DevHarnessShared = {
  module?: LoaderDef;
  debugPanel: boolean;
  edge: { Left: SampleEdgeLayout; Right: SampleEdgeLayout };
};

/**
 * Dynamic Loading
 */
export type LoaderDef = { typename: string; docuri: string; target?: string };
export type LoadFactory = (args: LoadFactoryArgs) => Promise<JSX.Element | void>;
export type LoadFactoryArgs = LoaderDef & { store: t.Store };
