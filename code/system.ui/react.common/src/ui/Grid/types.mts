import { type t } from './common';

type SizeValue = number | string;

/**
 * Component
 */
export type GridProps = {
  total?: number | GridXY;
  cell?: GridCellConfigure;
  column?: GridSizeConfigure;
  row?: GridSizeConfigure;
  gap?: number | Partial<GridXY>;
  style?: t.CssValue;
};

/**
 * Configuration
 */
export type GridCellHandler = (e: GridCell) => void;
export type GridCell = {
  x: number;
  y: number;
  body?: JSX.Element;
};

/**
 * Builder
 */
export type GridAxis = 'x' | 'y';
export type GridXY = { x: number; y: number };
export type GridSizeXY = { x: SizeValue; y: SizeValue };

export type GridCellConfigure = (e: GridCellConfigureArgs) => void;
export type GridCellConfigureArgs = GridXY & {
  total: GridXY;
  body(element: JSX.Element | null): GridCellConfigureArgs;
};

export type GridSizeConfigure = (e: GridSizeConfigureArgs) => SizeValue;
export type GridSizeConfigureArgs = {
  total: number;
  index: number;
};
