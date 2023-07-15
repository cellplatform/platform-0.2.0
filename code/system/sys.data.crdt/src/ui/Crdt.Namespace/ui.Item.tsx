import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, LabelItem } from './common';

export type ItemProps = {
  enabled?: boolean;
  placeholder?: string;
  style?: t.CssValue;
};

export const Item: React.FC<ItemProps> = (props) => {
  const { enabled = DEFAULTS.enabled, placeholder = DEFAULTS.placeholder } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <LabelItem
      //
      // text={'foo 🐷'}
      placeholder={placeholder}
      enabled={enabled}
      style={css(styles.base, props.style)}
    />
  );
};
