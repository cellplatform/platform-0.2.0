export * from '../common/t';
import { type t } from './common';

export type SampleEdge = {
  kind: t.NetworkConnectionEdgeKind;
  repo: t.RepoListModel;
  network: t.WebrtcStore;
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
