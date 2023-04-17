import { useEffect, useRef, useState } from 'react';
import { DEFAULTS, FC, Color, COLORS, css, t, rx, Pkg } from './common';
import { useKeyboard } from './useKeyboard.mjs';

export type DevHomeProps = {
  children?: JSX.Element;
  center?: boolean;
  pkg?: string | JSX.Element;
  keyboard?: boolean;
  style?: t.CssValue;
  onEnter?: () => void;
};

const View: React.FC<DevHomeProps> = (props) => {
  const { center = DEFAULTS.center, keyboard = DEFAULTS.keyboard, pkg, onEnter } = props;

  useKeyboard({
    enabled: keyboard,
    onEnter,
  });

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      placeItems: center ? 'center' : undefined,
    }),
    link: css({
      color: COLORS.CYAN,
      textDecoration: 'none',
      ':hover': { textDecoration: 'underline' },
    }),
    defaultContent: css({
      fontSize: 70,
      fontWeight: 'bold',
      letterSpacing: -2,
    }),
    pkg: css({
      Absolute: [null, 10, 10, null],
      cursor: 'default',
    }),
  };

  const elDefault = (
    <a href={'?dev'} {...styles.link}>
      <div {...styles.defaultContent}>{'?dev'}</div>
    </a>
  );
  const elContent = props.children || elDefault;
  const elPkg = pkg && <div {...styles.pkg}>{pkg}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elContent}
      {elPkg}
    </div>
  );
};

type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const DevHome = FC.decorate<DevHomeProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'DevHome' },
);
