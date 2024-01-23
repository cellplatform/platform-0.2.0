export * from '../common/t';
import { type t } from './common';

export type SampleEdge = {
  kind: t.NetworkConnectionEdgeKind;
  model: t.RepoListModel;
  network: t.NetworkStore;
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
export type SampleSharedOverlay = { module?: LoaderDef };

/**
 * Dynamic Loading
 */
export type LoaderDef = { typename: string; docuri: string };
export type LoadFactory = (args: LoadFactoryArgs) => Promise<JSX.Element | void>;
export type LoadFactoryArgs = LoaderDef & { store: t.Store };
