import { DEFAULTS, FC, type t } from './common';
import { Model } from './Model';
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
  { displayName: 'Connector' },
);
