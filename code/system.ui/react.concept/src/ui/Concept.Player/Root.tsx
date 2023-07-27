import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const ConceptPlayer = FC.decorate<t.ConceptPlayerProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'ConceptPlayer' },
);
