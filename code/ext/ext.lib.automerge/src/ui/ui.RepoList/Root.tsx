import { Model } from '../ui.RepoList.Model';
import { RepoListRef as Ref } from './Ref';
import { DEFAULTS, FC, type t } from './common';
import { RepoListConfig as Config } from './ui.Config';
import { MemoView } from './ui.Memo';

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
  MemoView,
  { DEFAULTS, Ref, Model, model, Config },
  { displayName: DEFAULTS.displayName },
);
