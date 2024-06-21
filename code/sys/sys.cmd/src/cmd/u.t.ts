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
