import type { t } from './common';

/**
 * Utility type helpers.
 */
export type CmdTypeMap<C extends t.CmdType> = {
  [K in C['name']]: C extends t.CmdType<K, infer P, infer R> ? t.CmdType<K, P, R> : never;
};

/**
 * Response Type Extraction
 */
export type ExtractRes<C extends t.CmdType> = C extends t.CmdType<any, any, infer R> ? R : never;
export type ExtractResName<C extends t.CmdType> = C extends t.CmdType<infer N, any, any>
  ? N
  : never;
export type ExtractResParams<C extends t.CmdType> =
  //
  ExtractRes<C> extends t.CmdType<any, infer P, any> ? P : never;
