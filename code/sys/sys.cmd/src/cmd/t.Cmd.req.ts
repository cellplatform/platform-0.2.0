import type { t, u } from './common';

type Tx = string;

/**
 * INVOKE methods:
 */
export type CmdInvokeOptions<C extends t.CmdType> = { tx?: Tx; error?: u.ExtractError<C> };
export type CmdInvokeResponseOptions<Req extends t.CmdType, Res extends t.CmdType> = {
  tx?: Tx;
  error?: u.ExtractError<Res>;
  dispose$?: t.UntilObservable;
  timeout?: t.Msecs;
  onComplete?: t.CmdResponseHandler<Req, Res>;
  onError?: t.CmdResponseHandler<Req, Res>;
  onTimeout?: t.CmdResponseHandler<Req, Res>;
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
export type CmdInvokeResponse<Req extends t.CmdType, Res extends t.CmdType> = (
  req: Req['name'],
  res: Res['name'],
  params: Req['params'],
  options?: Tx | t.CmdResponseHandler<Req, Res> | t.CmdInvokeResponseOptions<Req, Res>,
) => t.CmdResponseListener<Req, Res>;

/**
 * Request.
 */
export type CmdRequest<C extends t.CmdType> = {
  readonly name: C['name'];
  readonly params: C['params'];
};
