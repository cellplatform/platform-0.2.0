import { type t } from './common';

/**
 * Component
 */
export type PositionProps = {
  children?: JSX.Element | false;
  position?: t.EdgePositionInput;
  style?: t.CssValue;
};
