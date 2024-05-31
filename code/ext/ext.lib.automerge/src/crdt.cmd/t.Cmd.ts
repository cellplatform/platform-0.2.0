import type { t, u } from './common';

type Tx = string;

/**
 * Command API.
 */
export type Cmd<C extends t.CmdType> = {
  readonly events: t.CmdEventsFactory<C>;
  readonly invoke: CmdInvoker<C> & CmdResponseInvoker<C>;
};

/**
 * INVOKE methods:
 */
export type CmdInvokeOptionsInput<C extends t.CmdType> = CmdInvokeOptions<C> | Tx;
export type CmdInvokeOptions<C extends t.CmdType> = {
  tx?: Tx;
  error?: u.ExtractError<C>;
};

/**
 * Invoke with no response.
 */
export type CmdInvoker<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  params: u.CmdTypeMap<C>[N]['params'],
  options?: CmdInvokeOptionsInput<u.CmdTypeMap<C>[N]>,
) => t.CmdInvoked<u.CmdTypeMap<C>[N]>;

/**
 * Invoke with expected response.
 */
export type CmdResponseInvoker<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  responder: u.ExtractResName<C>,
  params: u.CmdTypeMap<C>[N]['params'],
  options?: CmdInvokeOptionsInput<u.CmdTypeMap<C>[N]>,
) => t.CmdResponseInvoked<u.CmdTypeMap<C>[N]>;
