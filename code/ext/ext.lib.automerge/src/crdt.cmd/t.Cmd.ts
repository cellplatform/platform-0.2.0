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
 * Invoke methods:
 */
export type CmdInvokeOptions = { tx?: Tx };
export type CmdInvokeOptionsInput = CmdInvokeOptions | Tx;

export type CmdInvoker<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  params: Extract<C, { name: N }>['params'],
  options?: CmdInvokeOptionsInput,
) => t.CmdInvoked<C>;

export type CmdResponseInvoker<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  responder: u.ExtractResName<C>,
  params: Extract<C, { name: N }>['params'],
  options?: CmdInvokeOptionsInput,
) => t.CmdResponseInvoked<C>;

/**
 * Response.
 */
export type CmdInvoked<C extends t.CmdType> = {
  readonly tx: Tx;
  readonly name: C['name'];
  readonly params: C['params'];
};

export type CmdResponseInvoked<C extends t.CmdType> = CmdInvoked<C> & {
  readonly listen: CmdListen<C>;
};

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
};

/**
 * Response Listener API.
 */
export type CmdListener<C extends t.CmdType> = t.Lifecycle & {
  readonly $: t.Observable<u.ExtractResParams<C>>;
  readonly ok: boolean;
  readonly tx: Tx;
  readonly status: 'Pending' | 'Complete' | 'Error' | 'Error:Timeout';
  readonly timedout: boolean;
  readonly result?: u.ExtractResParams<C>;
  promise(): Promise<CmdListener<C>>;
  onComplete(fn: CmdListenHandler<C>): CmdListener<C>;

  // TODO 🐷
  // onError(fn: CmdListenerHandler<C>): CmdListener<C>;
};

export type CmdListenHandler<C extends t.CmdType> = (e: CmdListener<C>) => void;
