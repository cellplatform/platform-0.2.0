import { css, type t } from '../common';

/**
 * Default Config
 */
export const config: t.GridPropsConfig = {
  gap: 3,

  row(e) {
    return 1;
  },

  cell(e) {
    const styles = {
      base: css({
        padding: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.05)' /* RED */,
      }),
    };

    const div = (text: string) => <div {...styles.base}>{text}</div>;

    // [A1]
    if (e.x === 0 && e.y === 0) {
      return div(`${e.address} → ⚠️ config not set`);
    }

    return div(e.address);
  },
};
