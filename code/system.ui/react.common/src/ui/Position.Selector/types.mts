import { type t } from './common';

/**
 * TODO 🐷
 * Move to [sys.types]
 */

/**
 * Cooridnate Positioning (Placement Concepts)
 */
export type PositionX = 'left' | 'right' | 'center';
export type PositionY = 'top' | 'bottom' | 'center';
export type Position = { x: PositionX; y: PositionY };
export type Pos = [PositionX, PositionY];
export type PositionInput = Position | Pos;

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
