import { css, type t } from '../common';

/**
 * Contants
 */
export const total: t.GridPoint = { x: 3, y: 3 };
export const config: t.GridPropsConfig = {
  gap: 3,

  row(e) {
    // return e.index === 0 ? 2.5 : 1;
    return 1;
  },
  cell(e) {
    const styles = {
      base: css({ padding: 5, backgroundColor: 'rgba(255, 0, 0, 0.05)' /* RED */ }),
      tree: css({ fontSize: 30 }),
    };
    // NB: showing as return value.
    if (e.x === 1 && e.y === 2) {
      return (
        <div {...css(styles.base)}>
          <div {...styles.tree}>{'🌳'}</div>
        </div>
      );
    }

    // NB: showing as method call.
    e.body(<div {...styles.base}>{`${e.address}`}</div>);

    return;
  },
};
