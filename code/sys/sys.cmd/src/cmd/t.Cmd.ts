import type { t } from './common';

/**
 * Command API.
 */
export type Cmd<C extends t.CmdType> = {
  readonly events: t.CmdEventsFactory<C>;
  readonly invoke: t.CmdInvoke<C> & t.CmdInvokeResponse<C>;
  readonly method: t.CmdMethodFactory<C>;
};
