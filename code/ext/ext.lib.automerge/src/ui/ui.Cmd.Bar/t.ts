import type { t } from './common';
export type CmdBarAction = 'Invoke';

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
  onTextChanged?: CmdBarTextChangedHandler;
  onCommand?: CmdBarTxHandler;
  onInvoked?: CmdBarTxHandler;
};

/**
 * Abstract path resolvers.
 */
export type CmdBarPaths = {
  text: t.ObjectPath;
  tx: t.ObjectPath;
};

/**
 * The shape of the default [CmdBarPaths] as an object.
 */
export type CmdBarLens = {
  text?: string;
  tx?: string;
};

/**
 * A fully resolved document object for a <CmdBar>.
 */
export type CmdBarLensObject = {
  text: string;
  tx: string;
};

/**
 * EVENTS
 */
export type CmdBarEvents = t.Lifecycle & {
  readonly $: t.Observable<CmdBarEvent>;
  readonly text$: t.Observable<CmdBarTextChanged>;
  readonly cmd: {
    readonly $: t.Observable<CmdBarTx>;
    readonly invoked$: t.Observable<CmdBarTx>;
  };
};

export type CmdBarEvent = CmdBarTxEvent | CmdBarTextChangedEvent;

/**
 * Fires when a command is invoked
 * (typically via the ENTER key press).
 */
export type CmdBarTxHandler = (e: CmdBarTx) => void;
export type CmdBarTxEvent = {
  type: 'crdt:cmdbar/Tx';
  payload: CmdBarTx;
};
export type CmdBarTx = { tx: string; text: string; cmd: t.CmdBarAction; is: { self: boolean } };

/**
 * Fires when the command bar's text changes.
 */
export type CmdBarTextChangedHandler = (e: CmdBarTextChanged) => void;
export type CmdBarTextChangedEvent = {
  type: 'crdt:cmdbar/TextChanged';
  payload: CmdBarTextChanged;
};
export type CmdBarTextChanged = { text: string };
