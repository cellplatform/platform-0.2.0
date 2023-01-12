import type * as t from './types.mjs';
import { Pkg } from '../index.pkg.mjs';

export { t, Pkg };

export * from './libs.mjs';
export * from './util.MediaStream.mjs';
export * from './util.Uri.mjs';
export * from './util.Filter.mjs';
export * from './util.String.mjs';

export const Module = {
  info: { name: Pkg.name, version: Pkg.version } as t.PeerModule,
};
