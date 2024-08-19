import { CrdtInfo, DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { IdentityLabel } from './ui.IdentityLabel';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  CrdtInfo: typeof CrdtInfo;
  IdentityLabel: typeof IdentityLabel;
};
export const CmdView = FC.decorate<t.CmdViewProps, Fields>(
  View,
  { DEFAULTS, CrdtInfo, IdentityLabel },
  { displayName: DEFAULTS.displayName },
);
