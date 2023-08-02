import { DEFAULTS, FC, type t } from './common';
import { View } from './view';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const EdgePositionSelector = FC.decorate<t.EdgePositionSelectorProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'EdgePositionSelector' },
);
