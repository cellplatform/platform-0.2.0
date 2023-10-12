import type { t } from './common';

type O = Record<string, unknown>;

/**
 * Item (Data Model)
 */
export type LabelItem<A extends t.LabelItemActionKind = string, D extends O = O> = {
  label?: string;
  placeholder?: string;
  enabled?: boolean;
  editing?: boolean;
  editable?: boolean;
  cmd?: t.LabelItemCommand; // Produces an event stream of commands when changed.
  left?: t.LabelItemAction<A> | t.LabelItemAction<A>[] | null;
  right?: t.LabelItemAction<A> | t.LabelItemAction<A>[] | null;
  data?: D;
};

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type LabelItemState<
  A extends t.LabelItemActionKind = string,
  D extends O = O,
> = t.ImmutableRef<t.LabelItem<A, D>, t.LabelItemStateEvents<A, D>>;

export type LabelItemStateEvents<
  A extends t.LabelItemActionKind = string,
  D extends O = O,
> = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.LabelItem<A, D>>>;
  readonly key: {
    readonly $: t.Observable<t.LabelItemKeyHandlerArgs>;
    readonly enter$: t.Observable<t.LabelItemKeyHandlerArgs>;
    readonly escape$: t.Observable<t.LabelItemKeyHandlerArgs>;
  };
  readonly cmd: {
    readonly $: t.Observable<t.LabelItemCommand>;
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
 * Commands (events as property stream)
 */
export type LabelItemCommand =
  | LabelItemKeydownCommand
  | LabelItemKeyupCommand
  | LabelItemClipboardCommand
  | LabelItemRedrawCommand
  | LabelItemActionInvokedCommand
  | LabelItemClickCommand
  | LabelItemChangedCommand;

export type LabelItemKeydownCommand = { type: 'Item:Keydown'; payload: LabelItemKeypress };
export type LabelItemKeyupCommand = { type: 'Item:Keyup'; payload: LabelItemKeypress };
export type LabelItemKeypress = t.LabelItemKeyHandlerArgs & { tx: string };

export type LabelItemClipboardCommand = { type: 'Item:Clipboard'; payload: LabelItemClipboard };
export type LabelItemClipboard = { action: 'Cut' | 'Copy' | 'Paste'; tx: string };

export type LabelItemRedrawCommand = { type: 'Item:Redraw'; payload: LabelItemRedraw };
export type LabelItemRedraw = { tx: string };

export type LabelItemActionInvokedCommand<K extends t.LabelItemActionKind = string> = {
  type: 'Item:Action';
  payload: LabelItemActionInvoked<K>;
};
export type LabelItemActionInvoked<K extends t.LabelItemActionKind = string> = {
  kind: K;
  position: t.LabelItemPosition;
  focused: boolean;
  selected: boolean;
  editing: boolean;
  tx: string;
};

export type LabelItemClickCommand = { type: 'Item:Click'; payload: LabelItemClick };
export type LabelItemClick = t.LabelItemClickHandlerArgs & { tx: string };

export type LabelItemChangedCommand = { type: 'Item:Changed'; payload: LabelItemChanged };
export type LabelItemChanged = t.LabelItemStateChangeHandlerArgs & { tx: string };