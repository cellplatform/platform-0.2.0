import { css, type t } from '../common';
import { Wrangle } from './u';

export type HostGridProps = {
  children?: JSX.Element;
  border?: string;
  renderProps?: t.DevRenderProps;
  style?: t.CssValue;
};

export const HostGrid: React.FC<HostGridProps> = (props) => {
  const { renderProps } = props;
  if (!renderProps?.subject.renderer) return null;

  const { size } = renderProps.subject;
  const fillMargin = Wrangle.fillMargin(size);
  const sizeMode = size?.mode ?? 'center';

  const is = {
    x: size?.mode === 'fill' && size.x && !size.y,
    y: size?.mode === 'fill' && !size.x && size.y,
  } as const;

  const GRID = {
    FILL: {
      COLUMNS: `[left] ${fillMargin[3]}px [body-x] 1fr [right] ${fillMargin[1]}px`,
      ROWS: `[top] ${fillMargin[0]}px [body-y] 1fr [bottom] ${fillMargin[2]}px`,
    },
    CENTER: {
      COLUMNS: `[left] 1fr [body-x] auto [right] 1fr`,
      ROWS: `[top] 1fr [body-y] auto [bottom] 1fr`,
    },
  } as const;

  /**
   * [Render]
   */
  const border = props.border;
  const borderLeft = border;
  const borderRight = border;
  const borderTop = border;
  const borderBottom = border;

  const styles = {
    base: css({ Absolute: 0, display: 'grid' }),
    block: css({ boxSizing: 'border-box', padding: 1 }),
    grid: {
      fill: css({
        gridTemplateColumns: is.y ? GRID.CENTER.COLUMNS : GRID.FILL.COLUMNS,
        gridTemplateRows: is.x ? GRID.CENTER.ROWS : GRID.FILL.ROWS,
      }),
      center: css({
        gridTemplateColumns: GRID.CENTER.COLUMNS,
        gridTemplateRows: GRID.CENTER.ROWS,
      }),
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
      <div {...styles.block} />
      <div {...css(styles.block, { borderLeft, borderRight })} />
      <div {...css(styles.block)} />
      <div {...css(styles.block, { borderTop, borderBottom })} />
      {props.children}
      <div {...css(styles.block, { borderTop, borderBottom })} />
      <div {...css(styles.block)} />
      <div {...css(styles.block, { borderLeft, borderRight })} />
      <div {...css(styles.block)} />
    </div>
  );
};
