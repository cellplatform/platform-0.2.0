/**
 * (Spike)
 * Ideas for 2D cartesian position types
 */

export type PosEdge = 'near' | 'center' | 'far';
export type PosEdgeXY = [PosEdge, PosEdge];

export type PosX = 'left' | 'center' | 'right';
export type PosY = 'top' | 'bottom';
export type PositonXY = [PosX, PosY];
