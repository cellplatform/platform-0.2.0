import { DEFAULTS, FC, type t } from './common';
import { Is } from './u';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Is: typeof Is;
};
export const PeerUriButton = FC.decorate<t.PeerUriButtonProps, Fields>(
  View,
  { DEFAULTS, Is },
  { displayName: DEFAULTS.displayName },
);
