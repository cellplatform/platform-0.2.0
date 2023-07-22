import { type t } from './common';

type RenderValue = JSX.Element | null | undefined | false;
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

export type GridCellConfigure = (e: GridCellConfigureArgs) => RenderValue | void; // NB: return value is the [body] if specified.
export type GridCellConfigureArgs = GridPoint & {
  address: t.CellAddress;
  total: GridPoint;
  body(element: RenderValue): GridCellConfigureArgs;
  toString(): string;
};

export type GridSizeConfigure = (e: GridSizeConfigureArgs) => SizeValue;
export type GridSizeConfigureArgs = {
  index: number;
  total: number;
};
