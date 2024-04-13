import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { resolver } from './u';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  resolver: typeof resolver;
};
export const NetworkCmdHost = FC.decorate<t.NetworkCmdHost, Fields>(
  View,
  { DEFAULTS, resolver },
  { displayName: DEFAULTS.displayName },
);
