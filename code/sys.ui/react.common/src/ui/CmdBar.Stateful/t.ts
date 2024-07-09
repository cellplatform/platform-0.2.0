import type { t } from './common';

/**
 * <Component>
 */
export type CmdBarStatefulProps = Omit<t.CmdBarProps, 'ctrl' | 'text' | 'onReady'> & {
  state?: t.CmdImmutable;
  paths?: t.CmdBarPaths;
  onReady?: t.CmdBarStatefulReadyHandler;
};

/**
 * Events
 */
export type CmdBarStatefulReadyHandler = (e: CmdBarStatefulReadyHandlerArgs) => void;
export type CmdBarStatefulReadyHandlerArgs = {
  readonly initial: { readonly text: string };
  readonly state: t.CmdImmutable;
  readonly paths: t.CmdBarPaths;
  readonly cmdbar: t.CmdBarRef;
  readonly textbox: t.TextInputRef;
  readonly dispose$: t.Observable<void>;
  events(dispose$?: t.UntilObservable): t.CmdEvents<t.CmdBarCtrlType>;
};
