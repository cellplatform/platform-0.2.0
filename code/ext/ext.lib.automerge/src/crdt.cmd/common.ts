import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const paths: t.CmdPaths = {
  tx: ['tx'],
  name: ['name'],
  params: ['params'],
};

export const DEFAULTS = { paths } as const;
