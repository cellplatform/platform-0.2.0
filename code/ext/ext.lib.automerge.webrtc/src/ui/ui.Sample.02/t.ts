export * from '../common/t';
import { type t } from './common';

export type SampleEdge = {
  kind: t.ConnectionEdgeKind;
  repo: t.RepoListModel;
  network: t.WebrtcStore;
};

/**
 * <Component>
 */
export type SampleEdgeLabel = { text: string; absolute?: t.CssEdgesInput };

export type SampleEdgeProps = {
  edge: t.SampleEdge;
  offsetLabel?: t.SampleEdgeLabel;
  focusOnLoad?: boolean;
  style?: t.CssValue;
  onStreamSelection?: t.PeerStreamSelectionHandler;
};
