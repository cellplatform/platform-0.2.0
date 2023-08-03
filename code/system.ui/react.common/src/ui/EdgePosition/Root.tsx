import { EdgePositionSelector as Selector } from '../EdgePosition.Selector';
import { css, DEFAULTS, FC, type t } from './common';
import { Wrangle } from './Wrangle.mjs';

const { gridCss: toGridCss, toPos, toPosition } = Wrangle;

const View: React.FC<t.EdgePositionProps> = (props) => {
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
  toPos: typeof toPos;
  toPosition: typeof toPosition;
};
export const EdgePosition = FC.decorate<t.EdgePositionProps, Fields>(
  View,
  { DEFAULTS, Selector, Wrangle, toGridCss, toPos, toPosition },
  { displayName: 'EdgePosition' },
);
