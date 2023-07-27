import { type t } from './common';

/**
 * Component
 */
export type PositionSelectorProps = {
  enabled?: boolean;
  size?: number;
  selected?: t.PositionInput;
  style?: t.CssValue;
  onSelect?: PositionClickHandler;
};

/**
 * Events
 */
export type PositionClickHandler = (e: PositionClickHandlerArgs) => void;
export type PositionClickHandlerArgs = {
  pos: t.Pos;
  position: t.Position;
};
