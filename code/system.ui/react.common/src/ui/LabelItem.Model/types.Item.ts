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
};

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type LabelItemState<A extends K = string, D extends O = O> = t.ImmutableRef<
  t.LabelItem<A, D>,
  t.LabelItemEvents<A, D>
>;

/**
 * Retrieve item (factory functions)
 */
export type GetLabelItem<A extends K = string, D extends O = O> = (
  target: Index | Id,
) => LabelItemStateIndex<A, D>;
export type LabelItemStateIndex<A extends K = string, D extends O = O> = [
  t.LabelItemState<A, D> | undefined,
  Index,
];

/**
 * Events API
 */
export type LabelItemEvents<A extends K = string, D extends O = O> = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.LabelItem<A, D>>>;
  readonly key: {
    readonly $: t.Observable<t.LabelItemKeyHandlerArgs>;
    readonly enter$: t.Observable<t.LabelItemKeyHandlerArgs>;
    readonly escape$: t.Observable<t.LabelItemKeyHandlerArgs>;
  };
  readonly cmd: {
    readonly $: t.Observable<t.LabelItemCmd>;
    readonly redraw$: t.Observable<void>;
    readonly changed$: t.Observable<t.LabelItemChanged>;
    readonly click$: t.Observable<t.LabelItemClick>;
    readonly action: {
      readonly $: t.Observable<t.LabelItemActionInvoked>;
      on(...kind: A[]): t.Observable<t.LabelItemActionInvoked<A>>;
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
  clipboard(e: t.LabelItemClipboard['action']): void;
  key: { down(e: t.LabelItemKeyHandlerArgs): void; up(e: t.LabelItemKeyHandlerArgs): void };
};

export type LabelItemCmd =
  | LabelItemKeydownCmd
  | LabelItemKeyupCmd
  | LabelItemClipboardCmd
  | LabelItemRedrawCmd
  | LabelItemActionInvokedCmd
  | LabelItemClickCmd
  | LabelItemChangedCmd;

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
  tx: string;
};

export type LabelItemClickCmd = { type: 'Item:Click'; payload: LabelItemClick };
export type LabelItemClick = t.LabelItemClickHandlerArgs & { tx: string };

export type LabelItemChangedCmd = { type: 'Item:Changed'; payload: LabelItemChanged };
export type LabelItemChanged = t.LabelItemStateChangedHandlerArgs & { tx: string };
