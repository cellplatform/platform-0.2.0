import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const paths: t.CmdHostPaths = { cmd: ['cmd'], address: ['address'] };

export const DEFAULTS = { paths } as const;
