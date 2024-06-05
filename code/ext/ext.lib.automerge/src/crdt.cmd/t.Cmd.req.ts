import type { t, u } from './common';

type Tx = string;

/**
 * INVOKE methods:
 */
export type CmdInvokeOptions<C extends t.CmdType> = {
  tx?: Tx;
  error?: u.ExtractError<C>;
};
export type CmdInvokeResponseOptions<C extends t.CmdType> = CmdInvokeOptions<C> & {
  dispose$?: t.UntilObservable;
  timeout?: t.Msecs;
  onComplete?: t.CmdResponseHandler<C>;
  onError?: t.CmdResponseHandler<C>;
};

/**
 * Invoke with no response.
 */
export type CmdInvoke<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  params: u.CmdTypeMap<C>[N]['params'],
  options?: Tx | CmdInvokeOptions<u.CmdTypeMap<C>[N]>,
) => t.CmdInvoked<u.CmdTypeMap<C>[N]>;

/**
 * Invoke with expected response.
 */
export type CmdInvokeResponse<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  responder: u.ExtractResName<C>,
  params: u.CmdTypeMap<C>[N]['params'],
  options?:
    | Tx
    | t.CmdResponseHandler<u.CmdTypeMap<C>[N]>
    | CmdInvokeResponseOptions<u.CmdTypeMap<C>[N]>,
) => t.CmdResponseListener<u.CmdTypeMap<C>[N]>;

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
