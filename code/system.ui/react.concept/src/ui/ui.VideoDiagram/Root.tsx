import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const VideoDiagram = FC.decorate<t.VideoDiagramProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Concept.VideoDiagram' },
);
