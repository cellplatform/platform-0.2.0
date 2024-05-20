import { Wrangle } from './u';
import { DEFAULTS, FC, css, type t } from './common';

export const View: React.FC<t.GridProps> = (props) => {
  const total = Wrangle.total(props);
  const config = Wrangle.config(props);
  const gap = config.gap;
  if (total.x === 0 && total.y === 0) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: Wrangle.toGridTemplate(config.columns),
      gridTemplateRows: Wrangle.toGridTemplate(config.rows),
      columnGap: `${gap.x}px`,
      rowGap: `${gap.y}px`,
    }),
    block: css({
      position: 'relative',
      boxSizing: 'border-box',
      display: 'grid',
    }),
  };

  const elements: JSX.Element[] = [];
  config.forEach((e) => {
    const el = (
      <div {...styles.block} key={e.cell} data-address={e.cell}>
        {e.body}
      </div>
    );
    elements.push(el);
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Grid = FC.decorate<t.GridProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);
