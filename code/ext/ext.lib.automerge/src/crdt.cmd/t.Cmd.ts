import type { t, u } from './common';

type Tx = string;

/**
 * Command API.
 */
export type Cmd<C extends t.CmdType> = {
  readonly invoke: CmdInvoke<C> & CmdInvokeResponse<C>;
  readonly events: t.CmdEventsFactory<C>;
};

/**
 * INVOKE methods:
 */
export type CmdInvokeOptionsInput<C extends t.CmdType> = CmdInvokeOptions<C> | Tx;
export type CmdInvokeOptions<C extends t.CmdType> = { tx?: Tx; error?: u.ExtractError<C> };

/**
 * Invoke with no response.
 */
export type CmdInvoke<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  params: u.CmdTypeMap<C>[N]['params'],
  options?: CmdInvokeOptionsInput<u.CmdTypeMap<C>[N]>,
) => t.CmdInvoked<u.CmdTypeMap<C>[N]>;

/**
 * Invoke with expected response.
 */
export type CmdInvokeResponse<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  responder: u.ExtractResName<C>,
  params: u.CmdTypeMap<C>[N]['params'],
  options?: CmdInvokeOptionsInput<u.CmdTypeMap<C>[N]>,
) => t.CmdResponseInvoked<u.CmdTypeMap<C>[N]>;

/**
 * Request.
 */
export type CmdRequest<C extends t.CmdType> = {
  readonly name: C['name'];
  readonly params: C['params'];
};

/**
 * Response.
 */
export type CmdInvoked<C extends t.CmdType> = {
  readonly tx: Tx;
  readonly req: t.CmdRequest<C>;
};

// TEMP 🐷 change to <CmdListener>
export type CmdResponseInvoked<C extends t.CmdType> = CmdInvoked<C> & {
  readonly listen: t.CmdListen<C>;
};
