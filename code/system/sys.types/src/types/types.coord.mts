/**
 *  Coordinate Positioning
 * (spacial placement on 2D rectangular plane)
 */
export type PositionX = 'left' | 'right' | 'center';
export type PositionY = 'top' | 'bottom' | 'center';
export type Position = { x: PositionX; y: PositionY };
export type Pos = [PositionX, PositionY];
export type PositionInput = Position | Pos;
