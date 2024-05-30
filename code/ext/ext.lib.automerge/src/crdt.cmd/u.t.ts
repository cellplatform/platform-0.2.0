import type { t } from './common';

/**
 * Utility type helpers.
 */
export type CmdTypeMap<C extends t.CmdType> = {
  [K in C['name']]: C extends t.CmdType<K, infer P, infer R> ? t.CmdType<K, P, R> : never;
};

/**
 * Extract: response types
 */
export type ExtractRes<T extends t.CmdType> = T extends t.CmdType<infer N, infer P, infer R>
  ? R extends t.CmdType<infer RN, infer RP>
    ? t.CmdType<RN, RP, t.CmdType<N, P>>
    : never
  : never;
export type ExtractResName<C extends t.CmdType> = ExtractRes<C>['name'];
export type ExtractResParams<C extends t.CmdType> = ExtractRes<C>['params'];
