import { type t } from './common';

/**
 * Component
 */
export type EdgePositionSelectorProps = {
  enabled?: boolean;
  size?: number;
  selected?: t.EdgePositionInput;
  style?: t.CssValue;
  onChange?: EdgePositionChangeHandler;
};

/**
 * Events
 */
export type EdgePositionChangeHandler = (e: EdgePositionChangeHandlerArgs) => void;
export type EdgePositionChangeHandlerArgs = {
  pos: t.EdgePos;
  position: t.EdgePosition;
};
