export type * from './t.cmd';
export type * from './t.cmd.res';
export type * from './t.doc';
export type * from './t.event';

type O = Record<string, unknown>;
type S = string;
type U = undefined;

/**
 * Definition of a command, eg:
 *
 *    type Add = CmdType<'add', { a: number; b: number }, AddR>;
 *    type AddR = CmdType<'add:res', { sum: number }>;
 *
 */
export type CmdType<N extends S = S, P extends O = O, R extends CmdType | U = U> = {
  name: N;
  params: P;
};
