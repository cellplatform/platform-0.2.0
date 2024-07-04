import type { t } from './common';

/**
 * <Component>
 */
export type CmdBarStatefulProps = Omit<t.CmdBarProps, 'onReady' | 'text'> & {
  paths?: t.CmdBarStatefulPaths;
  onReady?: t.CmdBarStatefulReadyHandler;
};

export type CmdBarStatefulPaths = {
  text: t.ObjectPath;
};

/**
 * Events
 */
export type CmdBarStatefulReadyHandler = (e: CmdBarStatefulReadyHandlerArgs) => void;
export type CmdBarStatefulReadyHandlerArgs = t.CmdBarReadyHandlerArgs & {
  /**
   * TODO 🐷
   */
};
