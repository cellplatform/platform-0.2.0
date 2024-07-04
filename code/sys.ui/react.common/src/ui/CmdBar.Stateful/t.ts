import type { t } from './common';

/**
 * <Component>
 */
export type CmdBarStatefulProps = Omit<t.CmdBarProps, 'onReady'> & {
  onReady?: t.CmdBarStatefulReadyHandler;
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
