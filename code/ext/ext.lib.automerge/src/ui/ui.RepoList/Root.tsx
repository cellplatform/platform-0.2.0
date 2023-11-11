import { Model } from '../ui.RepoList.Model';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { RepoListRef as Ref } from './Ref';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Model: typeof Model;
  Ref: typeof Ref;
};
export const RepoList = FC.decorate<t.RepoListProps, Fields>(
  View,
  { DEFAULTS, Model, Ref },
  { displayName: 'RepoList' },
);
