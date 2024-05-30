import type { t, u } from './common';

/**
 * Factory,
 */
export type CmdEventsFactory<C extends t.CmdType> = (dispose$?: t.UntilObservable) => CmdEvents<C>;

/**
 * Events API
 */
export type CmdEvents<C extends t.CmdType> = t.Lifecycle & {
  readonly $: t.Observable<CmdEvent>;
  readonly invoked$: t.Observable<CmdInvoked<C>>;
  readonly on: CmdEventsOnMethod<C>;
};

export type CmdEventsOnMethod<C extends t.CmdType> = <N extends C['name']>(
  name: N,
) => t.Observable<CmdInvoked<u.CmdTypeMap<C>[N]>>;

/**
 * EVENT (Definitions)
 */
export type CmdEvent = CmdInvokedEvent;

/**
 * Fires when a command is invoked via a new transaction (eg "fire").
 */
export type CmdInvokedEvent<C extends t.CmdType = t.CmdType> = {
  type: 'crdt:cmd/Invoked';
  payload: CmdInvoked<C>;
};
export type CmdInvoked<C extends t.CmdType = t.CmdType> = t.CmdType<C['name'], C['params']> & {
  tx: string;
  count: number;
};
