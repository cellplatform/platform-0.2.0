import type { t, u } from './common';

/**
 * Response Listener API.
 */
export type CmdResponseListener<C extends t.CmdType> = {
  readonly $: t.Observable<u.ExtractResParams<C>>;
  readonly ok: boolean;
  readonly status: 'Pending' | 'Complete' | 'Error' | 'Error:Timeout';
  readonly result?: u.ExtractResParams<C>;
  readonly error?: u.ExtractError<C>;
  promise(): Promise<CmdResponseListener<C>>;
  onComplete(fn: CmdResponseHandler<C>): CmdResponseListener<C>;
  onError(fn: CmdResponseHandler<C>): CmdResponseListener<C>;
} & t.CmdInvoked<C> &
  t.Lifecycle;

/**
 * Callbacks from the response listener.
 */
export type CmdResponseHandler<C extends t.CmdType> = (e: CmdResponseHandlerArgs<C>) => void;
export type CmdResponseHandlerArgs<C extends t.CmdType> = Pick<
  CmdResponseListener<C>,
  'ok' | 'tx' | 'result' | 'error'
> & { readonly cmd: t.Cmd<C> };
