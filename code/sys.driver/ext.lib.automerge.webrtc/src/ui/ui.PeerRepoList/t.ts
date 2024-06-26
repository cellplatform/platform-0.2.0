import type { t } from './common';

/**
 * <Component>
 */
export type PeerRepoListProps = {
  model?: t.RepoListModel;
  network?: t.NetworkStore;
  selected?: MediaStream;
  focusOnLoad?: boolean;
  avatarTray?: boolean;
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
