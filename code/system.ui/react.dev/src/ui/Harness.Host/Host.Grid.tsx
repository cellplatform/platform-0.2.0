import { css, t } from '../common';
import { Wrangle } from './Wrangle.mjs';

export type HarnessHostGridProps = {
  children?: JSX.Element;
  border: string;
  renderArgs?: t.SpecRenderArgs;
  style?: t.CssValue;
};

export const HarnessHostGrid: React.FC<HarnessHostGridProps> = (props) => {
  const { renderArgs, border } = props;

  if (!renderArgs) return null;

  const { size } = renderArgs;
  const fillMargin = Wrangle.fillMargin(size);
  const sizeMode = size?.mode ?? 'center';

  const isFillX = size?.mode === 'fill' && size.x && !size.y;
  const isFillY = size?.mode === 'fill' && !size.x && size.y;

  const GRID = {
    FILL: {
      COLUMNS: `[left] ${fillMargin[3]}px [body-x] 1fr [right] ${fillMargin[1]}px`,
      ROWS: `[top] ${fillMargin[0]}px [body-y] 1fr [bottom] ${fillMargin[2]}px`,
    },
    CENTER: {
      COLUMNS: `[left] 1fr [body-x] auto [right] 1fr`,
      ROWS: `[top] 1fr [body-y] auto [bottom] 1fr`,
    },
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ Absolute: 0, display: 'grid' }),

    grid: {
      fill: css({
        gridTemplateColumns: isFillY ? GRID.CENTER.COLUMNS : GRID.FILL.COLUMNS,
        gridTemplateRows: isFillX ? GRID.CENTER.ROWS : GRID.FILL.ROWS,
      }),
      center: css({
        gridTemplateColumns: GRID.CENTER.COLUMNS,
        gridTemplateRows: GRID.CENTER.ROWS,
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
