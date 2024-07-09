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
 * Object structure.
 */
export type CmdBarPaths = {
  text: t.ObjectPath;
  cmd: t.ObjectPath;
};

/**
 * Forwarded reference
 */
/**
 * Events
 */
export type CmdBarStatefulReadyHandler = (e: CmdBarStatefulReadyHandlerArgs) => void;
export type CmdBarStatefulReadyHandlerArgs = {
  readonly initial: { readonly text: string };
  readonly state: t.CmdImmutable;
  readonly paths: t.CmdBarPaths;
  readonly cmdbar: t.CmdBarCtrl;
  readonly textbox: t.TextInputRef;
  readonly dispose$: t.Observable<void>;
  events(dispose$?: t.UntilObservable): t.CmdEvents<t.CmdBarCtrlType>;
};
