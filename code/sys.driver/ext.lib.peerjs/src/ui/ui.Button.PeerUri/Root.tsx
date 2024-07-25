import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = { DEFAULTS: typeof DEFAULTS };
export const PeerUriButton = FC.decorate<t.PeerUriButtonProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);
