import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const PlayBar = FC.decorate<t.PlayBarProps__, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Concept.PlayBar' },
);
