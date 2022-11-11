import type { CssValue } from 'sys.util.css';

/**
 * An <Icon> component function.
 */
export type IconRenderer = (props: IconProps) => JSX.Element;

/**
 * Display properties for an icon.
 */
export type IconProps = {
  size?: number;
  color?: number | string;
  opacity?: number;
  style?: CssValue;
  onClick?: React.MouseEventHandler;
  onDoubleClick?: React.MouseEventHandler;
  onMouseDown?: React.MouseEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
};
