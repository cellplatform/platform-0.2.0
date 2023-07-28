/**
 *  Edge Coordinate Positioning
 * (spacial placement on 2D rectangular plane)
 */
export type EdgePositionX = 'left' | 'right' | 'center';
export type EdgePositionY = 'top' | 'bottom' | 'center';
export type EdgePositionXY = EdgePositionX | EdgePositionY;
export type EdgePosition = { x: EdgePositionX; y: EdgePositionY };
export type EdgePos = [EdgePositionX, EdgePositionY];
export type EdgePositionInput = EdgePosition | EdgePos;
