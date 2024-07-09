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
export type CmdBarRef = {
  readonly ctrl: t.CmdBarCtrl;
  readonly state: t.CmdImmutable;
  readonly paths: t.CmdBarPaths;
  readonly dispose$: t.Observable<void>;
};

/**
 * Events
 */
export type CmdBarStatefulReadyHandler = (e: CmdBarStatefulReadyHandlerArgs) => void;
export type CmdBarStatefulReadyHandlerArgs = {
  readonly initial: { readonly text: string };
  readonly cmdbar: t.CmdBarRef;
  readonly textbox: t.TextInputRef;
  readonly dispose$: t.Observable<void>;
};
