import { useStateController } from '../ui.Info.State';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  useStateController: typeof useStateController;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, useStateController },
  { displayName: DEFAULTS.displayName },
);
