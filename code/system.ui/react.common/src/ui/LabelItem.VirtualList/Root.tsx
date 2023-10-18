import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { useHandle } from './use.HandleRef';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  useHandle: typeof useHandle;
};

/**
 * A "virtual" (infinite) scrolling list
 */
export const VirtualList = FC.decorate<t.VirtualListProps, Fields>(
  View,
  { DEFAULTS, useHandle },
  { displayName: 'LabelItem.VirtualList' },
);
