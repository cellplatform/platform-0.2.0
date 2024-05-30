import type { t, u } from './common';

type O = Record<string, unknown>;
type S = string;

/**
 * Named definition of a command.
 */
export type CmdType<N extends S = S, P extends O = O, R extends CmdType | undefined = undefined> = {
  name: N;
  params: P;
};

/**
 * Command API.
 */
export type Cmd<C extends CmdType> = {
  readonly events: CmdEventsFactory<C>;
  readonly invoke: CmdInvokeMethod<C>;

  /**
   * TODO 🐷 override [invoke]
   * - ():void
   * - ('name:res'):response
   */
};

export type CmdInvokeMethod<C extends CmdType> = <T extends C['name']>(
  name: T,
  params: Extract<C, { name: T }>['params'],
  options?: CmdInvokeOptions | string,
) => CmdResponse<C>;
export type CmdInvokeOptions = { tx?: string };

/**
 * Command Response.
 */
export type CmdResponse<C extends CmdType> = {
  readonly tx: string;
  readonly name: C['name'];
  readonly params: C['params'];
  readonly listen: CmdListen<C>;
};

export type CmdListen<C extends CmdType> = (
  name: u.ExtractResName<C>,
  options?: CmdListenOptions<C> | CmdListenerCallback<C>,
) => CmdListener<C>;
export type CmdListenOptions<C extends CmdType> = {
  dispose$?: t.UntilObservable;
  timeout?: t.Msecs;
  onComplete?: CmdListenerCallback<C>;
};
export type CmdListenerCallback<C extends CmdType> = (e: CmdListener<C>) => void;

export type CmdListener<C extends CmdType> = t.Lifecycle & {
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

/**
 * Abstract resolver paths to the location of
 * the command structure within the CRDT.
 */
export type CmdPaths = {
  name: t.ObjectPath;
  params: t.ObjectPath;
  counter: t.ObjectPath;
  tx: t.ObjectPath;
};

/**
 * The shape of the default <CmdPaths> as an object.
 */
export type CmdPathsObject<C extends CmdType = CmdType> = {
  name?: C['name'];
  params?: C['params'];
  counter?: CmdCounter;
  tx?: string;
};
export type CmdCounter = { readonly value: number };

/**
 * A fully resolved document object for a <CmdLens>.
 */
export type CmdObject<C extends CmdType> = {
  name: C['name'];
  params: C['params'];
  count: number;
  tx: string;
};

/**
 * EVENTS
 */
export type CmdEventsFactory<C extends CmdType> = (dispose$?: t.UntilObservable) => CmdEvents<C>;
export type CmdEvents<C extends CmdType = CmdType> = t.Lifecycle & {
  readonly $: t.Observable<CmdEvent>;
  readonly invoked$: t.Observable<CmdInvoked<C>>;
  cmd<N extends C['name']>(name: N): t.Observable<CmdInvoked<u.CmdTypeMap<C>[N]>>;
};

/**
 * Event types union rollup.
 */
export type CmdEvent = CmdInvokedEvent;

/**
 * Fires when a command is invoked via a new transaction (eg "fire").
 */
export type CmdInvokedEvent<C extends CmdType = CmdType> = {
  type: 'crdt:cmd/Invoked';
  payload: CmdInvoked<C>;
};
export type CmdInvoked<C extends CmdType = CmdType> = CmdType<C['name'], C['params']> & {
  tx: string;
  count: number;
};
