import type { t, u } from './common';

/**
 * Command API.
 */
export type Cmd<C extends t.CmdType> = {
  readonly events: t.CmdEventsFactory<C>;
  readonly invoke: CmdInvoker<C> & CmdResponseInvoker<C>;
};

/**
 * Invoke methods:
 */
export type CmdInvokeOptions = { tx?: string };
export type CmdInvokeOptionsInput = CmdInvokeOptions | string;

export type CmdInvoker<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  params: Extract<C, { name: N }>['params'],
  options?: CmdInvokeOptionsInput,
) => Omit<t.CmdInvoked<C>, 'listen'>;

export type CmdResponseInvoker<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  responder: u.ExtractResName<C>,
  params: Extract<C, { name: N }>['params'],
  options?: CmdInvokeOptionsInput,
) => t.CmdInvoked<C>;

/**
 * Response.
 */
export type CmdInvoked<C extends t.CmdType> = {
  readonly tx: string;
  readonly name: C['name'];
  readonly params: C['params'];
  readonly listen: CmdListenMethod<C>;
};

/**
 * Command listener factory.
 */
export type CmdListenMethod<C extends t.CmdType> = (
  name: u.ExtractResName<C>,
  options?: CmdListenOptions<C> | CmdListenerHandler<C>,
) => CmdListener<C>;

export type CmdListenOptions<C extends t.CmdType> = {
  dispose$?: t.UntilObservable;
  timeout?: t.Msecs;
  onComplete?: CmdListenerHandler<C>;
};

/**
 * Response Listener API.
 */
export type CmdListener<C extends t.CmdType> = t.Lifecycle & {
  readonly $: t.Observable<u.ExtractResParams<C>>;
  readonly ok: boolean;
  readonly tx: string;
  readonly status: 'Pending' | 'Complete' | 'Error' | 'Error:Timeout';
  readonly timedout: boolean;
  readonly result?: u.ExtractResParams<C>;
  promise(): Promise<CmdListener<C>>;
  onComplete(fn: CmdListenerHandler<C>): CmdListener<C>;

  // TODO 🐷
  // onError(fn: CmdListenerHandler<C>): CmdListener<C>;
};

export type CmdListenerHandler<C extends t.CmdType> = (e: CmdListener<C>) => void;
