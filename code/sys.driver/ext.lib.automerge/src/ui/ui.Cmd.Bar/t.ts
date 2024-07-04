import type { t } from './common';

/**
 * <Component>
 */
export type CmdBarProps = {
  instance?: string;
  ctrl?: t.Cmd<t.CmdBarCtrlType>;
  doc?: t.Lens | t.Doc;
  paths?: t.CmdBarPaths;
  enabled?: boolean;
  debug?: string;
  focusOnReady?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
} & CmdBarHandlerProps;

export type CmdBarHandlerProps = {
  onReady?: CmdBarReadyHandler;
  onText?: CmdBarTextHandler;
  onCommand?: CmdBarTxHandler;
  onInvoke?: CmdBarTxHandler;
  onSelect?: t.TextInputSelectHandler;
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
export type CmdBarCommand = t.Cmd<CmdBarType>;
export type CmdBarType = CmdBarInvoke; // ← NB: extension point (union in other command-types over time).

export type CmdBarInvoke = t.CmdType<'Invoke', CmdBarInvokeParams>;
export type CmdBarInvokeTx = CmdBarTx<CmdBarInvoke>;
export type CmdBarInvokeParams = { text: string; parsed: t.ParsedArgs };

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
type Ctx = { ctx: CmdBarCommand };
export type CmdBarTxHandler<T extends C = C> = (e: CmdBarTx<T>, ctx: Ctx) => void;
export type CmdBarTxEvent<T extends C = C> = { type: 'crdt:cmdbar/tx'; payload: CmdBarTx<T> };
export type CmdBarTx<T extends C = C> = t.CmdTx<T>;

/**
 * Fires when the command bar's text changes.
 */
export type CmdBarTextHandler = (e: CmdBarText, ctx: Ctx) => void;
export type CmdBarTextEvent = { type: 'crdt:cmdbar/text'; payload: CmdBarText };
export type CmdBarText = { text: string };
