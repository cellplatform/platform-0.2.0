import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Info } from '../ui.Info';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Info: typeof Info;
};
export const PeerRepoList = FC.decorate<t.PeerRepoListProps, Fields>(
  View,
  { DEFAULTS, Info },
  { displayName: DEFAULTS.displayName },
);
