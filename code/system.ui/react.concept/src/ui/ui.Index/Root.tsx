import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Item } from './common';

const View: React.FC<t.IndexProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
    }),
  };

  const elList = Array.from({ length: 5 }).map((_, i) => {
    const text = `hello-${i}`;
    return <Item.Label.View key={i} label={text} />;
  });

  return <div {...css(styles.base, props.style)}>{elList}</div>;
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Root = FC.decorate<t.IndexProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Concept.Index' },
);
