import { DEFAULTS, FC, type t } from './common';
import { Model } from './Model';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Model: typeof Model;
};
export const RepoList = FC.decorate<t.RepoListProps, Fields>(
  View,
  { DEFAULTS, Model },
  { displayName: DEFAULTS.displayName },
);
