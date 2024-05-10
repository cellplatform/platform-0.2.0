import { DEFAULTS, FC, type t } from './common';
import { View } from './view';
import { Wrangle } from './Wrangle.mjs';

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
  { displayName: 'EdgePositionSelector' },
);
