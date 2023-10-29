import { DEFAULTS, FC, Model, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Model: typeof Model;
};
export const Connector = FC.decorate<t.ConnectorProps, Fields>(
  View,
  { DEFAULTS, Model },
  { displayName: 'Webrtc.Connector' },
);
