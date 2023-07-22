import { DEFAULTS, FC, Grid, css, type t } from './common';

import { Wrangle } from './Wrangle.mjs';
import { Cell } from './ui.Cell';

const View: React.FC<t.PositionSelectorProps> = (props) => {
  const { enabled = DEFAULTS.enabled, size = DEFAULTS.size, selected = DEFAULTS.selected } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', Size: size }),
    grid: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Grid
        style={styles.grid}
        config={{
          total: 3,
          cell(e) {
            const { position, pos } = Wrangle.position(e.x, e.y);
            const isSelected = Wrangle.eqPos(pos, Wrangle.pos(selected));
            const el = (
              <Cell
                enabled={enabled}
                position={position}
                selected={isSelected}
                onClick={(e) => props.onSelect?.(e)}
              />
            );
            // e.body(el);
            return el;
          },
        }}
      />
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const PositionSelector = FC.decorate<t.PositionSelectorProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'PositionSelector' },
);
