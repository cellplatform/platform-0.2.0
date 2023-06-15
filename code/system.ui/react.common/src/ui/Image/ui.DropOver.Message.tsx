import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, rx, FC, type t, DEFAULTS } from './common';

export type DropMessageProps = {
  settings?: t.ImageDropSettings;
  style?: t.CssValue;
};

export const DropMessage: React.FC<DropMessageProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 DropMessage`}</div>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  dropOverBlur(props: t.ImageProps) {
    return props.drop?.blur ?? DEFAULTS.drop.blur;
  },

  dropOverContent(props: t.ImageProps) {
    return props.drop?.content ?? DEFAULTS.drop.content;
  },
};
