import type { t, u } from './common';

type TxString = string;

/**
 * Factory.
 */
export type CmdEventsFactory<C extends t.CmdType> = (dispose$?: t.UntilObservable) => CmdEvents<C>;

/**
 * Events API
 */
export type CmdEvents<C extends t.CmdType> = t.Lifecycle & CmdEventsInner<C>;
type CmdEventsInner<C extends t.CmdType> = Pick<t.Lifecycle, 'dispose$' | 'disposed'> & {
  readonly $: t.Observable<CmdEvent>;
  readonly tx$: t.Observable<CmdTx<C>>;
  readonly error$: t.Observable<CmdTx<C>>;
  readonly on: t.CmdEventsOnMethod<C>;
  readonly issuer: t.CmdEventsIssuerMethod<C>;
};

export type CmdEventsOnMethod<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  handler?: CmdEventsOnMethodHandler<u.CmdTypeMap<C>[N]>,
) => t.Observable<CmdTx<u.CmdTypeMap<C>[N]>>;
export type CmdEventsOnMethodHandler<C extends t.CmdType> = (e: CmdTx<C>) => void;

export type CmdEventsIssuerMethod<C extends t.CmdType> = (
  issuer: t.IdString | t.IdString[],
) => CmdEventsInner<C>;

/**
 * EVENT (Definitions)
 */
export type CmdEvent = CmdTxEvent;

/**
 * Fires when a command is invoked via a new transaction (eg "fire").
 */
export type CmdTxEvent<C extends t.CmdType = t.CmdType> = {
  type: 'sys.cmd/tx';
  payload: CmdTx<C>;
};
export type CmdTx<C extends t.CmdType = t.CmdType> = {
  readonly name: C['name'];
  readonly params: C['params'];
  readonly error?: u.ExtractError<C>;
  readonly tx: TxString;
  readonly id: t.IdString;
  readonly issuer?: t.IdString;
};
