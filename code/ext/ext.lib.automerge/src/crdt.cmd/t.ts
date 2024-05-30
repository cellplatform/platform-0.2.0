export type * from './t.Cmd';
export type * from './t.Doc';
export type * from './t.Events';

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
export type CmdType<N extends S = S, P extends O = O, R extends CmdType | U = U> = {
  name: N;
  params: P;
};
