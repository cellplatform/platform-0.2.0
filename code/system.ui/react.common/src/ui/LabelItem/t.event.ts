import type { t } from './common';

export type LabelItemActionCtx = Record<string, unknown>;

/**
 * Events
 */
export type LabelItemReadyHandler = (e: LabelItemReadyHandlerArgs) => void;
export type LabelItemReadyHandlerArgs = {
  position: t.LabelItemPosition;
  ref: t.LabelItemRef;
};

export type LabelItemChangedHandler = (e: LabelItemChangeHandlerArgs) => void;
export type LabelItemChangeHandlerArgs = {
  position: t.LabelItemPosition;
  label: string;
};

export type LabelItemActionHandler = (e: LabelItemActionHandlerArgs) => void;
export type LabelItemActionHandlerArgs = {
  position: t.LabelItemPosition;
  kind: t.LabelItemActionKind;
  focused: boolean;
  selected: boolean;
  editing: boolean;
  ctx: t.LabelItemActionCtx;
};

export type LabelItemKeyHandler = (e: LabelItemKeyHandlerArgs) => void;
export type LabelItemKeyHandlerArgs = {
  position: t.LabelItemPosition;
  focused: boolean;
  selected: boolean;
  editing: boolean;
  code: string;
  is: t.KeyboardKeyFlags;
  handled(): void;
};

export type LabelItemFocusHandler = (e: LabelItemFocusHandlerArgs) => void;
export type LabelItemFocusHandlerArgs = {
  position: t.LabelItemPosition;
  focused: boolean;
};

export type LabelItemClickHandler = (e: LabelItemClickHandlerArgs) => void;
export type LabelItemClickHandlerArgs = {
  position: t.LabelItemPosition;
  focused: boolean;
  selected: boolean;
  editing: boolean;
  target: 'Item' | 'Item:Label' | 'Item:Action' | 'Away';
  kind: 'Single' | 'Double';
};
