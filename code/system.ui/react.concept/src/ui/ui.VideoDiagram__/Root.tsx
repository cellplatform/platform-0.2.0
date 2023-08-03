import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Dummy } from './ui.Dummy';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Dummy: typeof Dummy;
};
export const VideoDiagram = FC.decorate<t.VideoDiagramProps__OLD, Fields>(
  View,
  { DEFAULTS, Dummy },
  { displayName: 'Concept.VideoDiagram' },
);
