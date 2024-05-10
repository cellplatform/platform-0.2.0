/**
 * @external
 */
import type { stringify, parse } from 'yaml';
export type Yaml = {
  stringify: typeof stringify;
  parse: typeof parse;
};

/**
 * @local
 */
export * from '../types';
