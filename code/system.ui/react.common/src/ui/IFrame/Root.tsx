import { DEFAULTS, FC, type t } from './common';
import { View } from './Root.View';
import { Wrangle } from './Wrangle.mjs';

/**
 * Export
 */

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Wrangle: typeof Wrangle;
};
export const IFrame = FC.decorate<t.IFrameProps, Fields>(
  View,
  { DEFAULTS, Wrangle },
  { displayName: 'IFrame' },
);
