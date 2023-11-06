import { type t } from './common';
export * from '../common';

export { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
export { LabelItem } from '../LabelItem';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: 'LabelItem.VirtualList',
  overscan: 50,
} as const;
