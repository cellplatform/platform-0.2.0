import { CrdtInfo, DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  CrdtInfo: typeof CrdtInfo;
};
export const CmdView = FC.decorate<t.CmdViewProps, Fields>(
  View,
  { DEFAULTS, CrdtInfo },
  { displayName: DEFAULTS.displayName },
);
