import { Model } from '../ui.RepoList.Model';
import { RepoListRef as Ref } from './Ref';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Ref: typeof Ref;
  Model: typeof Model;
  model: typeof Model.init;
};
export const RepoList = FC.decorate<t.RepoListProps, Fields>(
  View,
  { DEFAULTS, Ref, Model, model: Model.init },
  { displayName: 'Crdt.RepoList' },
);
