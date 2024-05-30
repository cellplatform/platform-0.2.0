import type { t } from './common';

/**
 * Command API.
 */
export type Cmd<C extends t.CmdType> = {
  readonly events: t.CmdEventsFactory<C>;
  readonly invoke: CmdInvokeMethod<C>;

  /**
   * TODO 🐷 override [invoke]
   * - ():void
   * - ('name:res'):response ← thereby removing the need to pass .listen("name") param on response.
   */
};

export type CmdInvokeMethod<C extends t.CmdType> = <N extends C['name']>(
  name: N,
  params: Extract<C, { name: N }>['params'],
  options?: CmdInvokeOptions | string,
) => t.CmdResponse<C>;
export type CmdInvokeOptions = { tx?: string };
