import type { t } from './common';

type O = Record<string, unknown>;
type S = string;
type U = undefined;

/**
 * Definition of a command, eg:
 *
 *    type Add  = CmdType<'add', { a: number; b: number }, AddR>;
 *    type AddR = CmdType<'add:res', { sum: number }>;
 *
 */
export type CmdType<
  N extends S = S, //                 ← Name
  P extends O = O, //                 ← Params
  R extends CmdType | void = void, // ← Response
  E extends t.Error = t.Error, //     ← Error
> = {
  readonly name: N;
  readonly params: P;
};
