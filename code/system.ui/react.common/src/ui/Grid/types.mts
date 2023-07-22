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
  cell: t.CellAddress;
  position: GridPoint;
  body?: JSX.Element;
};

export type GridCellConfigure = (e: GridCellConfigureArgs) => void;
export type GridCellConfigureArgs = {
  cell: GridCellArgs;
  total: GridPoint;
  body(element: JSX.Element | null): GridCellConfigureArgs;
};

export type GridCellArgs = GridPoint & {
  address: t.CellAddress;
  toString(): string;
};

export type GridSizeConfigure = (e: GridSizeConfigureArgs) => SizeValue;
export type GridSizeConfigureArgs = {
  total: number;
  index: number;
};
