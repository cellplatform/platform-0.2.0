import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const PeerRepoList = FC.decorate<t.PeerRepoListProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);
