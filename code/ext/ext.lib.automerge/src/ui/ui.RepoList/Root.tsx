import { Model } from '../ui.RepoList.Model';
import { RepoListRef as Ref } from './Ref';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { RepoListConfig as Config } from './ui.Config';

const model = Model.init;

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Ref: typeof Ref;
  Model: typeof Model;
  model: typeof model;
  Config: typeof Config;
};
export const RepoList = FC.decorate<t.RepoListProps, Fields>(
  View,
  { DEFAULTS, Ref, Model, model, Config },
  { displayName: 'Crdt.RepoList' },
);
