import { Wrangle } from './Wrangle';
import { DEFAULTS, FC, t } from './common';

import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  toLoginMethods: typeof Wrangle.toLoginMethods;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, toLoginMethods: Wrangle.toLoginMethods },
  { displayName: 'Info' },
);
