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
  focusOnLoad?: boolean;
  debug?: PeerRepoListPropsDebug;
  style?: t.CssValue;
  onStreamSelection?: t.PeerStreamSelectionHandler;
};

export type PeerRepoListPropsDebug = { label?: PeerRepoListPropsDebugLabel };
export type PeerRepoListPropsDebugLabel = {
  text: string;
  absolute?: t.CssEdgesInput;
  align?: 'Left' | 'Right';
};
