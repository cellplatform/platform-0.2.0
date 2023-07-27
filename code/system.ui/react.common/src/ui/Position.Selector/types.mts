import { type t } from './common';

/**
 * Component
 */
export type PositionSelectorProps = {
  enabled?: boolean;
  size?: number;
  selected?: PositionInput;
  style?: t.CssValue;
  onSelect?: PositionClickHandler;
};

/**
 * Events
 */
export type PositionClickHandler = (e: PositionClickHandlerArgs) => void;
export type PositionClickHandlerArgs = {
  pos: Pos;
  position: Position;
};
