import { Pkg } from './common';
export * from '../common';

export { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
export { LabelItem } from '../ui.LabelItem';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:LabelItem.VirtualList`,
  overscan: 50,
  tabIndex: 0,
} as const;
