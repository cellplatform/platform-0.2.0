import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export const View: React.FC<t.ModuleLoaderProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      display: 'grid',
    }),
    body: css({ display: 'grid', gridTemplateRows: '1fr auto' }),
    main: css({ display: 'grid', placeItems: 'center' }),
    footer: css({
      height: 40,
      borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  /**
   * TODO 🐷
   */

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.main}>{`🐷 ${DEFAULTS.displayName}`}</div>
        <div {...styles.footer}>command bar</div>
      </div>
    </div>
  );
};
