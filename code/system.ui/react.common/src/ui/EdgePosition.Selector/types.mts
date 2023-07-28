import { type t } from './common';

/**
 * Component
 */
export type EdgePositionSelectorProps = {
  enabled?: boolean;
  size?: number;
  selected?: t.EdgePositionInput;
  style?: t.CssValue;
  onSelect?: EdgePositionClickHandler;
};

/**
 * Events
 */
export type EdgePositionClickHandler = (e: EdgePositionClickHandlerArgs) => void;
export type EdgePositionClickHandlerArgs = {
  pos: t.EdgePos;
  position: t.EdgePosition;
};
