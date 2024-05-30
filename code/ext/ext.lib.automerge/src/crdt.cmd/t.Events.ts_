import type { t, u } from './common';

/**
 * Factory.
 */
export type CmdEventsFactory<C extends t.CmdType> = (dispose$?: t.UntilObservable) => CmdEvents<C>;

/**
 * Events API
 */
export type CmdEvents<C extends t.CmdType> = t.Lifecycle & {
  readonly $: t.Observable<CmdEvent>;
  readonly tx$: t.Observable<CmdTx<C>>;
  readonly on: CmdEventsOnMethod<C>;
};

export type CmdEventsOnHandler<C extends t.CmdType> = (e: CmdTx<C>) => void;
export type CmdEventsOnMethod<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  handler?: CmdEventsOnHandler<Extract<C, { name: N }>>,
) => t.Observable<CmdTx<u.CmdTypeMap<C>[N]>>;

/**
 * EVENT (Definitions)
 */
export type CmdEvent = CmdTxEvent;

/**
 * Fires when a command is invoked via a new transaction (eg "fire").
 */
export type CmdTxEvent<C extends t.CmdType = t.CmdType> = {
  type: 'crdt:cmd/tx';
  payload: CmdTx<C>;
};
export type CmdTx<C extends t.CmdType = t.CmdType> = t.CmdType<C['name'], C['params']> & {
  tx: string;
  count: number;
};
