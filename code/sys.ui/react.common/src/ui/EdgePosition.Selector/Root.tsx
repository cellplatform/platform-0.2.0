import { DEFAULTS, FC, type t } from './common';
import { Wrangle } from './u';
import { View } from './ui';

const { toPos, toPosition } = Wrangle;

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  toPos: typeof toPos;
  toPosition: typeof toPosition;
};
export const EdgePositionSelector = FC.decorate<t.EdgePositionSelectorProps, Fields>(
  View,
  { DEFAULTS, toPos, toPosition },
  { displayName: DEFAULTS.displayName },
);
