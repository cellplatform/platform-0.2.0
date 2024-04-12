import { type t } from './common';
export * from '../common';

/**
 * Constants
 */
const paths: t.CmdHostPaths = { cmd: ['cmd'] };

export const DEFAULTS = { paths } as const;
