import type { t } from './common';

type O = Record<string, unknown>;
type S = string;

export type Cmd<C extends CmdType> = {
  readonly invoke: CmdInvokeMethod<C>;
  readonly events: CmdEventsFactory<C>;
};

export type CmdInvokeMethod<C extends CmdType> = <T extends C['name']>(
  name: T,
  params: Extract<C, { name: T }>['params'],
) => void;

/**
 * Named definition of a command.
 */
export type CmdType<N extends S = S, P extends O = O> = { readonly name: N; readonly params: P };
export type CmdTypeMap<C extends CmdType> = {
  [K in C['name']]: C extends CmdType<K, infer P> ? CmdType<K, P> : never;
};

/**
 * Abstract resolver paths to the location of
 * the command structure within the CRDT.
 */
export type CmdPaths = {
  name: t.ObjectPath;
  params: t.ObjectPath;
  counter: t.ObjectPath;
};

/**
 * The shape of the default <CmdPaths> as an object.
 */
export type CmdLens<C extends CmdType = CmdType> = {
  name?: C['name'];
  params?: C['params'];
  counter?: CmdCounter;
};
export type CmdCounter = { readonly value: number };

/**
 * A fully resolved document object for a <CmdLens>.
 */
export type CmdObject<C extends CmdType> = {
  name: C['name'];
  params: C['params'];
  count: number;
};

/**
 * EVENTS
 */
export type CmdEventsFactory<C extends CmdType> = (dispose$?: t.UntilObservable) => CmdEvents<C>;
export type CmdEvents<C extends CmdType = CmdType> = t.Lifecycle & {
  readonly $: t.Observable<CmdEvent>;
  readonly invoked$: t.Observable<CmdInvoked<C>>;
  name<N extends C['name']>(name: N): t.Observable<CmdInvoked<CmdTypeMap<C>[N]>>;
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
  count: number;
};
