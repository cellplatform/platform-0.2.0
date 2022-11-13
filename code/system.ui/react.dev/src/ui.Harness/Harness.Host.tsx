import { Color, COLORS, css, t } from '../common';

export type HarnessHostProps = {
  component?: t.SpecRenderProps;
  style?: t.CssValue;
};

export const HarnessHost: React.FC<HarnessHostProps> = (props) => {
  const { component = {} } = props;
  const cropmark = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      pointerEvents: 'none',
      userSelect: 'none',
      backgroundColor:
        component.backdropColor === undefined
          ? Color.alpha(COLORS.DARK, 0.02)
          : Color.format(component.backdropColor),
    }),
    grid: {
      base: css({
        Absolute: 0,
        display: 'grid',
      }),
      fill: css({
        gridTemplateColumns: `[left] 40px [body-x] 1fr [right] 40px`,
        gridTemplateRows: `[top] 40px [body-y] 1fr [bottom] 40px`,
      }),
      center: css({
        gridTemplateColumns: `[left] 1fr [body-x] auto [right] 1fr`,
        gridTemplateRows: `[top] 1fr [body-y] auto [bottom] 1fr`,
      }),
    },
    block: {
      base: css({ boxSizing: 'border-box', padding: 5 }),
    },
    component: {
      outer: css({ border: cropmark }),
      container: css({
        position: 'relative',
        pointerEvents: 'auto',
        userSelect: 'text',
        display: component.display,
        width: component.width,
        height: component.height,
        backgroundColor: Color.format(component.backgroundColor),
      }),
    },
  };

  const elComponent = (
    <div {...styles.component.outer}>
      <div {...styles.component.container}>{component.element}</div>
    </div>
  );

  const elGrid = (
    <div {...css(styles.grid.base, styles.grid.center)}>
      <div {...styles.block.base}>{'🎾 Harness.Host'}</div>
      <div
        {...css(styles.block.base, {
          borderLeft: cropmark,
          borderRight: cropmark,
        })}
      ></div>
      <div {...css(styles.block.base)}></div>
      <div
        {...css(styles.block.base, {
          borderTop: cropmark,
          borderBottom: cropmark,
        })}
      ></div>
      {elComponent}
      <div
        {...css(styles.block.base, {
          borderTop: cropmark,
          borderBottom: cropmark,
        })}
      ></div>
      <div {...css(styles.block.base)}></div>
      <div
        {...css(styles.block.base, {
          borderLeft: cropmark,
          borderRight: cropmark,
        })}
      ></div>
      <div {...css(styles.block.base)}></div>
    </div>
  );

  return <div {...css(styles.base, props.style)}>{elGrid}</div>;
};
