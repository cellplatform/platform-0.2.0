import { css, t } from '../common';
import { Wrangle } from './Wrangle.mjs';

export type HarnessHostGridProps = {
  children?: JSX.Element;
  border: string;
  renderProps?: t.SpecRenderProps;
  style?: t.CssValue;
};

export const HarnessHostGrid: React.FC<HarnessHostGridProps> = (props) => {
  const { renderProps, border } = props;

  if (!renderProps) return null;

  const { size } = renderProps;
  const fillMargin = Wrangle.fillMargin(size);
  const sizeMode = size?.mode ?? 'center';

  /**
   * [Render]
   */
  const styles = {
    base: css({ Absolute: 0, display: 'grid' }),

    grid: {
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
  };

  return (
    <div
      {...css(
        styles.base,
        sizeMode === 'center' ? styles.grid.center : undefined,
        sizeMode === 'fill' ? styles.grid.fill : undefined,
        props.style,
      )}
    >
      <div {...styles.block.base}></div>
      <div
        {...css(styles.block.base, {
          borderLeft: border,
          borderRight: border,
        })}
      ></div>
      <div {...css(styles.block.base)}></div>
      <div
        {...css(styles.block.base, {
          borderTop: border,
          borderBottom: border,
        })}
      ></div>
      {props.children}
      <div
        {...css(styles.block.base, {
          borderTop: border,
          borderBottom: border,
        })}
      ></div>
      <div {...css(styles.block.base)}></div>
      <div
        {...css(styles.block.base, {
          borderLeft: border,
          borderRight: border,
        })}
      ></div>
      <div {...css(styles.block.base)}></div>
    </div>
  );
};
