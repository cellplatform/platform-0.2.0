import { PositionSelector } from '../ui.PositionSelector';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  PositionSelector: typeof PositionSelector;
};
export const ConceptPlayer = FC.decorate<t.ConceptPlayerProps, Fields>(
  View,
  { DEFAULTS, PositionSelector },
  { displayName: 'ConceptPlayer' },
);
