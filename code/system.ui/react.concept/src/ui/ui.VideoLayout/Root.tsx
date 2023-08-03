import { DEFAULTS, FC, type t } from './common';
import { View } from './view';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const VideoLayout = FC.decorate<t.VideoLayoutProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'VideoLayout' },
);
