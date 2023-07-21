import { type t } from './common';

type SizeValue = number | string;
export type GridPoint = { x: number; y: number };
export type GridSizePoint = { x: SizeValue; y: SizeValue };

/**
 * Component
 */
export type GridProps = {
  config?: GridPropsConfig;
  style?: t.CssValue;
};

export type GridPropsConfig = {
  total?: number | GridPoint;
  cell?: GridCellConfigure;
  column?: GridSizeConfigure;
  row?: GridSizeConfigure;
  gap?: number | Partial<GridPoint>;
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

export type GridCellConfigure = (e: GridCellConfigureArgs) => void;
export type GridCellConfigureArgs = GridPoint & {
  total: GridPoint;
  body(element: JSX.Element | null): GridCellConfigureArgs;
};

export type GridSizeConfigure = (e: GridSizeConfigureArgs) => SizeValue;
export type GridSizeConfigureArgs = {
  total: number;
  index: number;
};
