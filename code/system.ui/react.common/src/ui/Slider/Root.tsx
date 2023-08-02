import { DEFAULTS, FC, type t } from './common';
import { View } from './view';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Slider = FC.decorate<t.SliderProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Slider' },
);
