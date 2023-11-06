import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const MediaToolbar = FC.decorate<t.MediaToolbarProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Connector.MediaToolbar' },
);
