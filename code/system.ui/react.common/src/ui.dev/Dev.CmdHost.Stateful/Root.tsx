import { DEFAULTS, FC, Filter, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Filter: typeof Filter;
};
export const CmdHostStateful = FC.decorate<t.CmdHostStatefulProps, Fields>(
  View,
  { DEFAULTS, Filter },
  { displayName: DEFAULTS.displayName },
);
