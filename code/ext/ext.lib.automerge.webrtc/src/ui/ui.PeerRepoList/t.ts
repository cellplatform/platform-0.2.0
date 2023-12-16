import type { t } from './common';

export type PeerRepoList = {
  kind: t.ConnectionEdgeKind; // TEMP 🐷
  repo: t.RepoListModel;
  network: t.WebrtcStore;
};

/**
 * <Component>
 */
export type PeerRepoListProps = {
  edge?: t.PeerRepoList;
  offsetLabel?: t.SampleEdgeLabel;
  focusOnLoad?: boolean;
  style?: t.CssValue;
  onStreamSelection?: t.PeerStreamSelectionHandler;
};

export type SampleEdgeLabel = { text: string; absolute?: t.CssEdgesInput };
