import type { t } from '../common.t';
import { Pkg } from '../index.pkg.mjs';

/**
 * Constants
 */
export const Module = {
  info: { name: Pkg.name, version: Pkg.version } as t.PeerModule,
} as const;
