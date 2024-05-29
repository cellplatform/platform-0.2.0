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
  onText?: CmdBarTextHandler;
  onCommand?: CmdBarTxHandler;
  onInvoked?: CmdBarTxHandler;
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
  cmd?: t.CmdLens<CmdBarType>;
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
    readonly invoked$: t.Observable<CmdBarInvokeTx>;
  };
};

export type CmdBarEvent = CmdBarTxEvent | CmdBarTextEvent;

/**
 * Fires when a command is invoked
 * (typically via the ENTER key press).
 */
type C = CmdBarType;
export type CmdBarTxHandler<T extends C = C> = (e: CmdBarTx<T>) => void;
export type CmdBarTxEvent<T extends C = C> = { type: 'crdt:cmdbar/Tx'; payload: CmdBarTx<T> };
export type CmdBarTx<T extends C = C> = t.CmdInvoked<T>;

/**
 * Fires when the command bar's text changes.
 */
export type CmdBarTextHandler = (e: CmdBarText) => void;
export type CmdBarTextEvent = { type: 'crdt:cmdbar/Text'; payload: CmdBarText };
export type CmdBarText = { text: string };
