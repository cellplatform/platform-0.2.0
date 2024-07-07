import type { t } from './common';

type O = Record<string, unknown>;
type S = t.ImmutableRef<O, t.ImmutableEvents<O, unknown>, unknown>;

/**
 * <Component>
 */
export type CmdBarStatefulProps = Omit<t.CmdBarProps, 'onReady' | 'text'> & {
  state?: S;
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
  readonly paths: t.CmdBarStatefulPaths;
  readonly dispose$: t.Observable<void>;
  events(dispose$?: t.UntilObservable): t.CmdEvents<t.CmdBarCtrlType>;
};
