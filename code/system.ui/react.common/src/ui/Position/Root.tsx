import { css, DEFAULTS, FC, type t } from './common';

import { PositionSelector as Selector } from '../Position.Selector';
import { Wrangle } from './Wrangle.mjs';

const toGridCss = Wrangle.gridCss;

const View: React.FC<t.PositionProps> = (props) => {
  const styles = {
    base: css({
      position: 'relative',
      ...toGridCss(props.position),
    }),
  };
  return <div {...css(styles.base, props.style)}>{props.children}</div>;
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Selector: typeof Selector;
  Wrangle: typeof Wrangle;
  toGridCss: typeof toGridCss;
};
export const Position = FC.decorate<t.PositionProps, Fields>(
  View,
  { DEFAULTS, Selector, Wrangle, toGridCss },
  { displayName: 'Position' },
);
