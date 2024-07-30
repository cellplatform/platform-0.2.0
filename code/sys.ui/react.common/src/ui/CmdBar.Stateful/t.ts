import type { t } from './common';

/**
 * <Component>
 */
export type CmdBarStatefulProps = Omit<t.CmdBarProps, 'ctrl' | 'text' | 'onReady'> & {
  state?: t.CmdTransport;
  paths?: t.CmdBarPaths | t.ObjectPath;
  useHistory?: boolean;
  onReady?: t.CmdBarStatefulReadyHandler;
};

/**
 * Forwarded reference
 */
export type CmdBarRef = {
  readonly ctrl: t.CmdBarCtrl;
  readonly current: CmdBarCurrent;
  readonly paths: t.CmdBarPaths;
  readonly resolve: t.CmdBarPathResolver;
  readonly dispose$: t.Observable<void>;
  onChange(fn: (e: CmdBarCurrent) => void, dispose$?: t.UntilObservable): t.Lifecycle;
};

export type CmdBarCurrent = {
  readonly text: string;
  readonly focused: boolean;
  readonly selection: t.TextInputSelection;
};

/**
 * Events
 */
export type CmdBarStatefulReadyHandler = (e: CmdBarStatefulReadyHandlerArgs) => void;
export type CmdBarStatefulReadyHandlerArgs = {
  readonly initial: { readonly text: string };
  readonly cmdbar: t.CmdBarRef;
  readonly textbox: t.TextInputRef;
  readonly paths: t.CmdBarPaths;
  readonly dispose$: t.Observable<void>;
};
