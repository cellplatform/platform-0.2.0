import { Wrangle } from './Wrangle.mjs';
import { COLORS, Color, DEFAULTS, FC, css, type t } from './common';

const View: React.FC<t.SplitLayoutProps> = (props) => {
  const { debug = false, axis = DEFAULTS.axis, children = [] } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      ...Wrangle.gridCss(props),
    }),
    container: css({ position: 'relative', display: 'grid' }),
    top: css({}),
    bottom: css({}),
    debug: css({
      Absolute: axis === 'x' ? [0, 0, null, 0] : [0, null, 0, 0],
      width: axis === 'y' ? 1 : undefined,
      height: axis === 'x' ? 1 : undefined,
      pointerEvents: 'none',
      backgroundColor: Color.alpha(COLORS.RED, 0.1),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...css(styles.container, styles.top)}>{children[0]}</div>
      <div {...css(styles.container, styles.bottom)}>
        {children[1]}
        {debug && <div {...styles.debug} />}
      </div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const SplitLayout = FC.decorate<t.SplitLayoutProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'SplitLayout' },
);
