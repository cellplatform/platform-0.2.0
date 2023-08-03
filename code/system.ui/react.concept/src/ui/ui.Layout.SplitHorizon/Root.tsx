import { Wrangle } from './Wrangle.mjs';
import { COLORS, Color, DEFAULTS, FC, css, type t } from './common';

const View: React.FC<t.SplitHorizonProps> = (props) => {
  const { debug = false } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      ...Wrangle.gridCss(props),
    }),
    top: css({ position: 'relative' }),
    bottom: css({ position: 'relative' }),
    debug: css({
      Absolute: [0, 0, null, 0],
      borderTop: `solid 1px ${Color.alpha(COLORS.RED, 0.1)}`,
      pointerEvents: 'none',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.top}>
        <div>top</div>
      </div>
      <div {...styles.bottom}>
        {debug && <div {...styles.debug} />}
        <div>bottom</div>
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
export const SplitHorizon = FC.decorate<t.SplitHorizonProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'SplitHorizon' },
);
