import { Wrangle } from './Wrangle.mjs';
import { Color, DEFAULTS, css, type t } from './common';

export const View: React.FC<t.SplitLayoutProps> = (props) => {
  const { debug = false, axis = DEFAULTS.axis } = props;
  const debugColor = Color.debug(debug);
  const children = Wrangle.children(props);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: debugColor(0.06),
      ...Wrangle.gridCss(props),
    }),
    container: css({ position: 'relative', display: 'grid' }),
    top: css({ backgroundColor: debugColor(0.03) }),
    bottom: css({ backgroundColor: debugColor(0.03) }),
    debug: css({
      Absolute: axis === 'x' ? [0, 0, null, 0] : [0, null, 0, 0],
      width: axis === 'y' ? 1 : undefined,
      height: axis === 'x' ? 1 : undefined,
      pointerEvents: 'none',
      backgroundColor: debugColor(0.2),
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
