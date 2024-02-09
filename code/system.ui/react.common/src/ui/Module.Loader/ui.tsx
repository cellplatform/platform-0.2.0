import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Flip } from './common';

export const View: React.FC<t.ModuleLoaderProps> = (props) => {
  const { flipped = false } = props;

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
    }),
    body: css({
      display: 'grid',
      placeItems: 'center',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  const elBody = <div {...styles.body}>{`🐷 ${DEFAULTS.displayName}`}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      <Flip flipped={flipped} front={elBody} back={props.back?.element} />
    </div>
  );
};
