import type { t } from './common';
export type * from './t.doc';
export type * from './t.events';
export type * from './t.res';

type O = Record<string, unknown>;
type S = string;

/**
 * Named definition of a command.
 */
export type CmdType<N extends S = S, P extends O = O, R extends CmdType | undefined = undefined> = {
  name: N;
  params: P;
};

/**
 * Command API.
 */
export type Cmd<C extends CmdType> = {
  readonly events: t.CmdEventsFactory<C>;
  readonly invoke: CmdInvokeMethod<C>;

  /**
   * TODO 🐷 override [invoke]
   * - ():void
   * - ('name:res'):response
   */
};

export type CmdInvokeMethod<C extends CmdType> = <T extends C['name']>(
  name: T,
  params: Extract<C, { name: T }>['params'],
  options?: CmdInvokeOptions | string,
) => t.CmdResponse<C>;
export type CmdInvokeOptions = { tx?: string };
