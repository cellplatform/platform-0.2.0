import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export const View: React.FC<t.HashViewProps> = (props) => {
  console.log(DEFAULTS.displayName, props); // TEMP 🐷

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
      display: 'grid',
      gridTemplateRows: `auto 1fr`,
    }),
    titlbar: css({
      borderBottom: `solid 1px ${Color.alpha(theme.fg, 0.1)}`,
      padding: 10,
      boxSizing: 'border-box',
    }),
    body: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elTitle = <div {...styles.titlbar}>{`🐷 ${DEFAULTS.displayName}`}</div>;

  const elBody = <div {...styles.body}>{'Hello'}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elTitle}
      {elBody}
    </div>
  );
};
