import { DEFAULTS, FC, type t } from './common';
import { View } from './view';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const VideoDiagramLayout = FC.decorate<t.VideoDiagramLayoutProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'VideoDiagramLayout' },
);
