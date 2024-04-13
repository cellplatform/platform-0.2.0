import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const paths: t.CmdhostPaths = {
  cmd: ['cmd'],
  address: ['address'],
  selected: ['selected'],
};

export const DEFAULTS = { paths } as const;
