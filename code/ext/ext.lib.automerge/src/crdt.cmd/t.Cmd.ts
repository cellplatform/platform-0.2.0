import type { t } from './common';

/**
 * Command API.
 */
export type Cmd<C extends t.CmdType> = {
  readonly invoke: t.CmdInvoke<C> & t.CmdInvokeResponse<C>;
  readonly events: t.CmdEventsFactory<C>;
};
