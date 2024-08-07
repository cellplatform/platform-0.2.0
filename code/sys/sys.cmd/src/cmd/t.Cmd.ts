import type { t } from './common';

type Tx = string;
export type CmdTxFactory = () => Tx;

/**
 * Command API.
 */
export type Cmd<C extends t.CmdType> = {
  readonly invoke: t.CmdInvoke<C>;
  readonly events: t.CmdEventsFactory<C>;
  readonly method: t.CmdMethodFactory<C>;
};
