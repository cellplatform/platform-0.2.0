export type * from './t.Vercel';

/**
 * @vendor
 */
// export type { VercelConfigFile, VercelHttpDeployResponse } from 'ext.vercel/src/types.mjs';

/**
 * @system
 */
export type { EventBus, DirManifest, Msecs } from 'sys.types/src/types';
export type { Fs } from 'sys.fs/src/types.mjs';
export type { Text } from 'sys.text/src/types';

/**
 * @local
 */
export * from '../types.mjs';
