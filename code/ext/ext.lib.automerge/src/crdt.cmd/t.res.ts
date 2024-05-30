import type { t, u } from './common';

/**
 * Command Response.
 */
export type CmdResponse<C extends t.CmdType> = {
  readonly tx: string;
  readonly name: C['name'];
  readonly params: C['params'];
  readonly listen: CmdListen<C>;
};

export type CmdListen<C extends t.CmdType> = (
  name: u.ExtractResName<C>,
  options?: CmdListenOptions<C> | CmdListenerCallback<C>,
) => CmdListener<C>;
export type CmdListenOptions<C extends t.CmdType> = {
  dispose$?: t.UntilObservable;
  timeout?: t.Msecs;
  onComplete?: CmdListenerCallback<C>;
};
export type CmdListenerCallback<C extends t.CmdType> = (e: CmdListener<C>) => void;

export type CmdListener<C extends t.CmdType> = t.Lifecycle & {
  readonly $: t.Observable<u.ExtractResParams<C>>;
  readonly ok: boolean;
  readonly tx: string;
  readonly status: 'Pending' | 'Complete' | 'Error' | 'Error:Timeout';
  readonly timedout: boolean;
  readonly result?: u.ExtractResParams<C>;
  onComplete(fn: CmdListenerCallback<C>): CmdListener<C>;

  // TODO 🐷
  // onError(fn: CmdListenerCallback<C>): CmdListener<C>;
};
