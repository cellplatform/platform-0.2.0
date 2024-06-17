import type { t } from './common';

type O = Record<string, unknown>;
type S = string;
type U = undefined;

/**
 * Definition of a command, eg:
 *
 *    type Add  = CmdType<'add', { a: number; b: number }, AddR>;
 *    type AddR = CmdType<'add:res', { sum: number }>;
 */
export type CmdType<
  N extends S = S,
  P extends O = O,
  R extends CmdType | U = U,
  E extends t.Error = t.Error,
> = {
  readonly name: N;
  readonly params: P;
};
