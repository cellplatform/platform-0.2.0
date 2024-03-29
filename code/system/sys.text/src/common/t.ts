/**
 * @external
 */
import type { stringify, parse } from 'yaml';
export type Yaml = {
  stringify: typeof stringify;
  parse: typeof parse;
};

/**
 * @system
 */
export type { Fs } from 'sys.fs/src/types';

/**
 * @local
 */
export * from '../types';
