import type { t } from './common';

/**
 * Utility type helpers.
 */
export type CmdTypeMap<C extends t.CmdType> = {
  [K in C['name']]: Extract<C, { name: K }>;
};

/**
 * Extract
 */
export type ExtractError<T extends t.CmdType> = T extends t.CmdType<
  infer N,
  infer P,
  infer R,
  infer E
>
  ? E
  : never;

/**
 * Extract: response types
 */
export type ExtractRes<T extends t.CmdType> = T extends t.CmdType<
  infer N,
  infer P,
  infer R,
  infer E
>
  ? R extends t.CmdType<infer RN, infer RP, infer RR, infer RE>
    ? t.CmdType<RN, RP, t.CmdType<N, P, R, E>, RE>
    : never
  : never;

export type ExtractResName<C extends t.CmdType> = ExtractRes<C>['name'];
export type ExtractResParams<C extends t.CmdType> = ExtractRes<C>['params'];
