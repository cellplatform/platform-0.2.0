import type { t, u } from './common';

type Tx = string;

/**
 * Command listener factory.
 */
export type CmdListen<C extends t.CmdType> = (
  options?: CmdListenOptions<C> | CmdListenHandler<C>,
) => CmdListener<C>;

export type CmdListenOptions<C extends t.CmdType> = {
  dispose$?: t.UntilObservable;
  timeout?: t.Msecs;
  onComplete?: CmdListenHandler<C>;
  onError?: CmdListenHandler<C>;
};

/**
 * Response Listener API.
 */
export type CmdListener<C extends t.CmdType> = {
  readonly $: t.Observable<u.ExtractResParams<C>>;
  readonly ok: boolean;
  readonly status: 'Pending' | 'Complete' | 'Error' | 'Error:Timeout';
  readonly result?: u.ExtractResParams<C>;
  readonly error?: u.ExtractError<C>;
  promise(): Promise<CmdListener<C>>;
  onComplete(fn: CmdListenHandler<C>): CmdListener<C>;
  onError(fn: CmdListenHandler<C>): CmdListener<C>;
} & t.CmdInvoked<C> &
  t.Lifecycle;

export type CmdListenHandler<C extends t.CmdType> = (e: CmdListenHandlerArgs<C>) => void;
export type CmdListenHandlerArgs<C extends t.CmdType> = Pick<
  CmdListener<C>,
  'ok' | 'tx' | 'result' | 'error'
> & { readonly cmd: t.Cmd<C> };
