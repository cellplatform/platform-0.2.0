import { type t } from './common';

/**
 * Component
 */
export type PositionProps = {
  children?: JSX.Element | false;
  position?: t.PositionInput;
  style?: t.CssValue;
};
