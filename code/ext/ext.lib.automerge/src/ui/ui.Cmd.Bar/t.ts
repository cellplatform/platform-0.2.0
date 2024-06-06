import type { t } from './common';

/**
 * <Component>
 */
export type CmdBarProps = {
  instance?: string;
  enabled?: boolean;
  doc?: t.Lens | t.DocRef;
  paths?: t.CmdBarPaths;
  debug?: string;
  focusOnReady?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
} & CmdBarHandlers;

export type CmdBarHandlers = {
  onReady?: CmdBarReadyHandler;
  onText?: CmdBarTextHandler;
  onCommand?: CmdBarTxHandler;
  onInvoke?: CmdBarTxHandler;
};

/**
 * Abstract path resolvers.
 */
export type CmdBarPaths = {
  text: t.ObjectPath;
  cmd: t.CmdPaths;
};

/**
 * The shape of the default [CmdBarPaths] as an object.
 */
export type CmdBarLens = {
  text?: string;
  cmd?: t.CmdPathsObject<CmdBarType>;
};

/**
 * <CmdBar>:Commands
 */
export type CmdBarCmd = t.Cmd<CmdBarType>;
export type CmdBarType = CmdBarInvoke; // ← NB: extension point (union in other command-types over time).

export type CmdBarInvoke = t.CmdType<'Invoke', CmdBarInvokeParams>;
export type CmdBarInvokeTx = CmdBarTx<CmdBarInvoke>;
export type CmdBarInvokeParams = { text: string; action: CmdBarInvokeAction };
export type CmdBarInvokeAction = 'Enter';

/**
 * EVENTS
 */
export type CmdBarEvents = t.Lifecycle & {
  readonly instance: string;
  readonly text$: t.Observable<CmdBarText>;
  readonly cmd: {
    readonly $: t.Observable<CmdBarTx>;
    readonly tx$: t.Observable<CmdBarInvokeTx>;
  };
};

export type CmdBarEvent = CmdBarTxEvent | CmdBarTextEvent;

/**
 * Ready
 */
export type CmdBarReadyHandler<T extends C = C> = (e: CmdBarReady<T>) => void;
export type CmdBarReady<T extends C = C> = { readonly cmd: t.Cmd<T> };

/**
 * Fires when a command is invoked
 * (typically via the ENTER key press).
 */
type C = CmdBarType;
export type CmdBarTxHandler<T extends C = C> = (e: CmdBarTx<T>, cmd: CmdBarCmd) => void;
export type CmdBarTxEvent<T extends C = C> = { type: 'crdt:cmdbar/tx'; payload: CmdBarTx<T> };
export type CmdBarTx<T extends C = C> = t.CmdTx<T>;

/**
 * Fires when the command bar's text changes.
 */
export type CmdBarTextHandler = (e: CmdBarText, cmd: CmdBarCmd) => void;
export type CmdBarTextEvent = { type: 'crdt:cmdbar/text'; payload: CmdBarText };
export type CmdBarText = { text: string };
