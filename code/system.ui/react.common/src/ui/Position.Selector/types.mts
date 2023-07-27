import { type t } from './common';

/**
 * Component
 */
export type PositionSelectorProps = {
  enabled?: boolean;
  size?: number;
  selected?: t.EdgePositionInput;
  style?: t.CssValue;
  onSelect?: PositionClickHandler;
};

/**
 * Events
 */
export type PositionClickHandler = (e: PositionClickHandlerArgs) => void;
export type PositionClickHandlerArgs = {
  pos: t.EdgePos;
  position: t.EdgePosition;
};
