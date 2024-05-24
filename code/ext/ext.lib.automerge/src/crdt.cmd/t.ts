import type { t } from './common';

type O = Record<string, unknown>;
type S = string;

export type Cmd<C extends t.CmdTx> = {
  fire<T extends C['cmd']>(cmd: T, params: Extract<C, { cmd: T }>['params']): void;
  events(dispose$?: t.UntilObservable): CmdEvents<C>;
};

/**
 * Abstract resolver paths to the location of
 * the command structure within the CRDT.
 */
export type CmdPaths = {
  tx: t.ObjectPath;
  cmd: t.ObjectPath;
  params: t.ObjectPath;
};

/**
 * The shape of the default <CmdPaths> as an object.
 */
export type CmdLens<P extends O = O> = {
  tx?: string;
  cmd?: string;
  params?: P;
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
  readonly tx$: t.Observable<CmdTx<C['cmd'], C['params']>>;
};

export type CmdEvent = CmdTxEvent;

/**
 * Fires when a command is invoked via a new transaction (eg "fire").
 */
export type CmdTxHandler<T extends S = S, P extends O = O> = (e: CmdTx<T, P>) => void;
export type CmdTxEvent<T extends S = S, P extends O = O> = {
  type: 'crdt:cmd/tx';
  payload: CmdTx<T, P>;
};
export type CmdTx<T extends S = S, P extends O = O> = {
  tx: string;
  cmd: T;
  params: P;
};
