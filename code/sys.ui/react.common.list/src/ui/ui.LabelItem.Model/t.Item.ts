import type { t } from './common';

type Id = string;
type Index = number;
type O = Record<string, unknown>;
type K = t.LabelItemActionKind;

/**
 * Item (Data Model)
 */
export type LabelItem<A extends K = string, D extends O = O> = {
  label?: string;
  placeholder?: string;
  enabled?: boolean;
  editable?: boolean;
  cmd?: t.LabelItemCmd; // Used to produce an event stream of commands.
  left?: t.LabelItemAction<A> | t.LabelItemAction<A>[] | null;
  right?: t.LabelItemAction<A> | t.LabelItemAction<A>[] | null;
  data?: D;
  redraw?: number;
};

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type LabelItemState<A extends K = string, D extends O = O> = t.ImmutableRef<
  t.LabelItem<A, D>,
  t.PatchOperation,
  t.LabelItemEvents<A, D>
> & { typename?: string };

/**
 * Retrieve item (factory functions)
 */
export type GetLabelItem<A extends K = string, D extends O = O> = (
  target?: Index | Id,
) => LabelItemStateIndex<A, D>;
export type LabelItemStateIndex<A extends K = string, D extends O = O> = [
  t.LabelItemState<A, D> | undefined,
  Index,
];

export type GetLabelItemRenderers<
  A extends t.LabelItemActionKind = string,
  D extends O = O,
> = (args: {
  position: t.LabelItemPosition;
  item: t.LabelItemState<A, D>;
}) => t.LabelItemRenderers<A>;

/**
 * Events API
 */
export type LabelItemEvents<A extends K = string, D extends O = O> = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.LabelItem<A, D>>>;
  readonly key: {
    readonly $: t.Observable<t.LabelItemKeyHandlerArgs>;
    readonly enter$: t.Observable<t.LabelItemKeyHandlerArgs>;
    readonly escape$: t.Observable<t.LabelItemKeyHandlerArgs>;
    on(
      filter: (e: t.LabelItemKeyHandlerArgs) => boolean,
      handler?: (e: t.LabelItemKeyHandlerArgs) => void,
    ): void;
  };
  readonly cmd: {
    readonly $: t.Observable<t.LabelItemCmd>;
    readonly redraw$: t.Observable<void>;
    readonly changed$: t.Observable<t.LabelItemChangedCmdArgs>;
    readonly click$: t.Observable<t.LabelItemClickCmdArgs>;
    readonly edit$: t.Observable<t.LabelItemEditCmdArgs>;
    readonly edited$: t.Observable<t.LabelItemEditedCmdArgs>;
    readonly action: {
      readonly $: t.Observable<t.LabelItemActionInvoked>;
      kind(...kind: A[]): t.Observable<t.LabelItemActionInvoked<A>>;
    };
    readonly clipboard: {
      readonly $: t.Observable<t.LabelItemClipboard>;
      readonly cut$: t.Observable<t.LabelItemClipboard>;
      readonly copy$: t.Observable<t.LabelItemClipboard>;
      readonly paste$: t.Observable<t.LabelItemClipboard>;
    };
  };
};

/**
 * Commands
 * (events as a property stream)
 */
export type LabelItemDispatch = {
  redraw(): void;
  changed(e: t.LabelItemStateChangedHandlerArgs): void;
  action(e: t.LabelItemActionHandlerArgs): void;
  click(e: t.LabelItemClickHandlerArgs): void;
  edit(action: LabelItemEditCmdArgs['action']): void;
  edited(action: LabelItemEditedCmdArgs['action']): void;
  clipboard(e: t.LabelItemClipboard['action']): void;
  key: {
    down(e: t.LabelItemKeyHandlerArgs): void;
    up(e: t.LabelItemKeyHandlerArgs): void;
  };
};

export type LabelItemCmd =
  | LabelItemKeydownCmd
  | LabelItemKeyupCmd
  | LabelItemClipboardCmd
  | LabelItemRedrawCmd
  | LabelItemActionInvokedCmd
  | LabelItemClickCmd
  | LabelItemChangedCmd
  | LabelItemEditCmd
  | LabelItemEditedCmd;

export type LabelItemKeydownCmd = { type: 'Item:Keydown'; payload: LabelItemKeypress };
export type LabelItemKeyupCmd = { type: 'Item:Keyup'; payload: LabelItemKeypress };
export type LabelItemKeypress = t.LabelItemKeyHandlerArgs & { tx: string };

export type LabelItemClipboardCmd = { type: 'Item:Clipboard'; payload: LabelItemClipboard };
export type LabelItemClipboard = { action: 'Cut' | 'Copy' | 'Paste'; tx: string };

export type LabelItemRedrawCmd = { type: 'Item:Redraw'; payload: LabelItemRedraw };
export type LabelItemRedraw = { tx: string };

export type LabelItemActionInvokedCmd<A extends K = string> = {
  type: 'Item:Action';
  payload: LabelItemActionInvoked<A>;
};
export type LabelItemActionInvoked<A extends K = string> = {
  kind: A;
  position: t.LabelItemPosition;
  focused: boolean;
  selected: boolean;
  editing: boolean;
  ctx: t.LabelItemActionCtx;
  tx: string;
};

export type LabelItemClickCmd = { type: 'Item:Click'; payload: LabelItemClickCmdArgs };
export type LabelItemClickCmdArgs = t.LabelItemClickHandlerArgs & { tx: string };

export type LabelItemChangedCmd = { type: 'Item:Changed'; payload: LabelItemChangedCmdArgs };
export type LabelItemChangedCmdArgs = t.LabelItemStateChangedHandlerArgs & { tx: string };

export type LabelItemEditCmd = { type: 'Item:Edit'; payload: LabelItemEditCmdArgs };
export type LabelItemEditCmdArgs = {
  readonly tx: string;
  readonly action: 'start' | 'accept' | 'cancel' | 'toggle';
  readonly cancelled: boolean;
  cancel(): void;
};

export type LabelItemEditedCmd = { type: 'Item:Edited'; payload: LabelItemEditedCmdArgs };
export type LabelItemEditedCmdArgs = {
  readonly tx: string;
  readonly action: 'accepted' | 'cancelled';
  readonly label: string;
};
