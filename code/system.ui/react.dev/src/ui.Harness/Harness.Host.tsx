import { Color, COLORS, css, t } from '../common';

export type HarnessHostProps = {
  component?: t.SpecRenderProps;
  style?: t.CssValue;
};

export const HarnessHost: React.FC<HarnessHostProps> = (props) => {
  const { component = {} } = props;
  const cropmark = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;

  const { size } = component;
  const componentSize = Wrangle.componentSize(size);
  const fillMargin = Wrangle.fillMargin(size);
  const sizeMode = size?.mode ?? 'center';

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
        gridTemplateColumns: `[left] ${fillMargin[3]}px [body-x] 1fr [right] ${fillMargin[1]}px`,
        gridTemplateRows: `[top] ${fillMargin[0]}px [body-y] 1fr [bottom] ${fillMargin[2]}px`,
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
      outer: css({
        position: 'relative',
        border: cropmark,
      }),
      container: css({
        position: 'relative',
        Absolute: sizeMode === 'fill' ? 0 : undefined,
        pointerEvents: 'auto',
        userSelect: 'text',
        display: component.display,
        width: componentSize.width,
        height: componentSize.height,
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
    <div
      {...css(
        styles.grid.base,
        sizeMode === 'center' ? styles.grid.center : undefined,
        sizeMode === 'fill' ? styles.grid.fill : undefined,
      )}
    >
      <div {...styles.block.base}></div>
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

/**
 * Helpers
 */

const Wrangle = {
  componentSize(value?: t.SpecRenderSize) {
    let width: number | undefined;
    let height: number | undefined;

    if (!value) return { width, height };
    if (value.mode === 'fill') return { width, height };

    width = value.width;
    height = value.height;
    return { width, height };
  },

  fillMargin(value?: t.SpecRenderSize) {
    const DEFAULT = 40;
    if (!value) return Wrangle.asMargin(DEFAULT);
    if (value.mode !== 'fill') return Wrangle.asMargin(DEFAULT);
    return value.margin;
  },

  asMargin(value: number): [number, number, number, number] {
    return [value, value, value, value];
  },
};
