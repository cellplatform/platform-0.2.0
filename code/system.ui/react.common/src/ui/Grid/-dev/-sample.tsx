import { css, type t } from '../common';

export const config: t.GridPropsConfig = {
  gap: 3,

  row(e) {
    return 1;
  },
  cell(e) {
    const styles = {
      base: css({ padding: 5, backgroundColor: 'rgba(255, 0, 0, 0.05)' /* RED */ }),
      tree: css({ fontSize: 30 }),
    };

    // [B3]
    // Note: showing as return value.
    if (e.x === 1 && e.y === 2) {
      return (
        <div {...css(styles.base)}>
          <div {...styles.tree}>{'🌳'}</div>
        </div>
      );
    }

    // NOTE: sample showing as method call, not return value.
    e.body(<div {...styles.base}>{`${e.address}`}</div>);
    return;
  },
};

export const SAMPLE = { config } as const;
