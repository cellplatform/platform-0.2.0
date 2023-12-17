import type { t } from './common';

/**
 * <Component>
 */
export type PeerRepoListProps = {
  repo?: t.RepoListModel;
  network?: t.WebrtcStore;
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
