import { Wrangle } from './Wrangle.mjs';
import { COLORS, Color, DEFAULTS, FC, css, type t } from './common';
import { View } from './view';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  percent: typeof Wrangle.percent;
};
export const SplitLayout = FC.decorate<t.SplitLayoutProps, Fields>(
  View,
  { DEFAULTS, percent: Wrangle.percent },
  { displayName: 'SplitLayout' },
);
