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
export const StoreList = FC.decorate<t.StoreListProps, Fields>(
  View,
  { DEFAULTS, Model },
  { displayName: 'StoreList' },
);
