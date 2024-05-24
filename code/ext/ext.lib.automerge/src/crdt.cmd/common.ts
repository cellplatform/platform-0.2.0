import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const paths: t.CmdPaths = {
  tx: ['tx'],
  cmd: ['cmd'],
  params: ['params'],
};

export const DEFAULTS = { paths } as const;
