import type { t } from './common';

type O = Record<string, unknown>;
type S = string;

export type Cmd<C extends CmdType> = {
  readonly invoke: CmdInvoke<C>;
  readonly events: CmdEventsFactory<C>;
};

export type CmdInvoke<C extends CmdType> = <T extends C['name']>(
  name: T,
  params: Extract<C, { name: T }>['params'],
) => void;

/**
 * Named definition of a command.
 */
export type CmdType<N extends S = S, P extends O = O> = { readonly name: N; readonly params: P };

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
  readonly tx$: t.Observable<CmdTx<C>>;
};

/**
 * Event types union rollup.
 */
export type CmdEvent = CmdTxEvent;

/**
 * Fires when a command is invoked via a new transaction (eg "fire").
 */
export type CmdTxHandler<C extends CmdType = CmdType> = (e: CmdTx<C>) => void;
export type CmdTxEvent<C extends CmdType = CmdType> = {
  type: 'crdt:cmd/Tx';
  payload: CmdTx<C>;
};
export type CmdTx<C extends CmdType = CmdType> = CmdType<C['name'], C['params']> & {
  count: number;
};
