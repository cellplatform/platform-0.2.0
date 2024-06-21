import type { t, u } from './common';

type Tx = string;

/**
 * Generates a typed method function.
 */
export type CmdMethodFactory<C extends t.CmdType> = {
  <K extends C['name']>(req: K): CmdMethodVoid<u.CmdTypeMap<C>[K]>;
  <K extends C['name'], R extends C['name']>(req: K, res: R): CmdMethodResponder<
    u.CmdTypeMap<C>[K],
    u.CmdTypeMap<C>[R]
  >;
};

/**
 * Void response.
 */
export type CmdMethodVoid<Req extends t.CmdType> = {
  readonly name: Req['name'];
  readonly invoke: <N extends Req['name']>(
    params: u.CmdTypeMap<Req>[N]['params'],
    options?: Tx | t.CmdInvokeOptions<u.CmdTypeMap<Req>[N]>,
  ) => t.CmdInvoked<u.CmdTypeMap<Req>[N]>;
};

/**
 * Listener response.
 */
export type CmdMethodResponder<Req extends t.CmdType, Res extends t.CmdType> = {
  readonly name: { readonly req: Req['name']; readonly res: Res['name'] };
  readonly invoke: <N extends Req['name']>(
    params: u.CmdTypeMap<Req>[N]['params'],
    options?:
      | Tx
      | t.CmdResponseHandler<u.CmdTypeMap<Req>[N]>
      | t.CmdInvokeResponseOptions<u.CmdTypeMap<Req>[N]>,
  ) => t.CmdResponseListener<u.CmdTypeMap<Req>[N]>;
};
