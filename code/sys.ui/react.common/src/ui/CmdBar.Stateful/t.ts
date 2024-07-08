import type { t } from './common';

type O = Record<string, unknown>;
type S = t.ImmutableRef<O, t.ImmutableEvents<O, unknown>, unknown>;

/**
 * <Component>
 */
export type CmdBarStatefulProps = Omit<t.CmdBarProps, 'onReady' | 'text'> & {
  state?: S;
  paths?: t.CmdBarPaths;
  onReady?: t.CmdBarStatefulReadyHandler;
};

/**
 * Events
 */
export type CmdBarStatefulReadyHandler = (e: CmdBarStatefulReadyHandlerArgs) => void;
export type CmdBarStatefulReadyHandlerArgs = t.CmdBarReadyHandlerArgs & {
  readonly paths: t.CmdBarPaths;
  readonly dispose$: t.Observable<void>;
  events(dispose$?: t.UntilObservable): t.CmdEvents<t.CmdBarCtrlType>;
};
