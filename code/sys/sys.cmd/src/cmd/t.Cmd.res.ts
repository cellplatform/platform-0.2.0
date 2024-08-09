import type { t, u } from './common';

/**
 * Response.
 */
export type CmdInvoked<C extends t.CmdType> = {
  readonly tx: t.TxString;
  readonly req: t.CmdRequest<C>;
};

/**
 * Response Listener API.
 */
export type CmdResponseListener<Req extends t.CmdType, Res extends t.CmdType> = {
  readonly tx: t.TxString;
  readonly req: t.CmdRequest<Req>;
  readonly $: t.Observable<Res['params']>;
  readonly ok: boolean;
  readonly status: 'Pending' | 'Complete' | 'Error' | 'Timeout';
  readonly result?: Res['params'];
  readonly error?: u.ExtractError<Res>;
  promise(): Promise<CmdResponseListener<Req, Res>>;
  onComplete(fn: CmdResponseHandler<Req, Res>): CmdResponseListener<Req, Res>;
  onError(fn: CmdResponseHandler<Req, Res>): CmdResponseListener<Req, Res>;
  onTimeout(fn: CmdResponseHandler<Req, Res>): CmdResponseListener<Req, Res>;
} & t.Lifecycle;

/**
 * Callbacks from the response listener.
 */
export type CmdResponseHandler<Req extends t.CmdType, Res extends t.CmdType> = (
  e: CmdResponseHandlerArgs<Req, Res>,
) => void;

export type CmdResponseHandlerArgs<Req extends t.CmdType, Res extends t.CmdType> = Pick<
  CmdResponseListener<Req, Res>,
  'ok' | 'tx' | 'result' | 'error'
>;
