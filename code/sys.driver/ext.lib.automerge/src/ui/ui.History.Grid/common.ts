import { Pkg, type t } from './common';

export * from '../common';

/**
 * Constants
 */
const name = 'History.Grid';
const props: t.PickRequired<t.HistoryGridProps, 'theme' | 'hashLength'> = {
  theme: 'Dark',
  hashLength: 6,
};

export const DEFAULTS = {
  displayName: `${Pkg.name}:${name}`,
  props,
  empty: { message: 'nothing to display' },
} as const;
