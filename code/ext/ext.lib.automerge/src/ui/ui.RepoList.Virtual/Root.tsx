import { DEFAULTS, FC, RepoList, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  RepoList: typeof RepoList;
  model: typeof RepoList.model;
  Config: typeof RepoList.Config;
};
export const RepoListVirtual = FC.decorate<t.RepoListVirtualProps, Fields>(
  View,
  { DEFAULTS, RepoList, model: RepoList.model, Config: RepoList.Config },
  { displayName: DEFAULTS.displayName },
);
