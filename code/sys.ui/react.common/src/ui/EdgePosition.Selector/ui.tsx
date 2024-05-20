import { DEFAULTS, Grid, css, type t } from './common';
import { Wrangle } from './u';
import { Cell } from './ui.Cell';

export const View: React.FC<t.EdgePositionSelectorProps> = (props) => {
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
            const isSelected = Wrangle.eqPos(pos, Wrangle.toPos(selected));
            return (
              <Cell
                enabled={enabled}
                position={position}
                selected={isSelected}
                onClick={(e) => props.onChange?.(e)}
              />
            );
          },
        }}
      />
    </div>
  );
};
