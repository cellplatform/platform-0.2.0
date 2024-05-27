import type { t } from './common';

type O = Record<string, unknown>;
type S = string;

export type Cmd<C extends t.CmdTx> = {
  invoke<T extends C['name']>(name: T, params: Extract<C, { name: T }>['params']): void;
  events(dispose$?: t.UntilObservable): CmdEvents<C>;
};

/**
 * Named definition of a command.
 */
export type CmdType<N extends S = S, P extends O = O> = { name: N; params: P };

/**
 * Abstract resolver paths to the location of
 * the command structure within the CRDT.
 */
export type CmdPaths = {
  name: t.ObjectPath;
  params: t.ObjectPath;
  count: t.ObjectPath;
};

/**
 * The shape of the default <CmdPaths> as an object.
 */
export type CmdLens<P extends O = O> = {
  name?: string;
  params?: P;
  count?: CmdCount;
};

/**
 * A fully resolved document object for a <CmdLens>.
 */
export type CmdLensObject<P extends O = O> = Required<CmdLens<P>>;

/**
 * EVENTS
 */
export type CmdEvents<C extends CmdTx = CmdTx> = t.Lifecycle & {
  readonly $: t.Observable<CmdEvent>;
  readonly tx$: t.Observable<CmdTx<C['name'], C['params']>>;
};

export type CmdEvent = CmdTxEvent;

/**
 * Fires when a command is invoked via a new transaction (eg "fire").
 */
export type CmdTxHandler<N extends S = S, P extends O = O> = (e: CmdTx<N, P>) => void;
export type CmdTxEvent<N extends S = S, P extends O = O> = {
  type: 'crdt:cmd/tx';
  payload: CmdTx<N, P>;
};
export type CmdTx<C extends S = S, P extends O = O> = CmdType<C, P> & { count: CmdCount };
export type CmdCount = { value: number };
