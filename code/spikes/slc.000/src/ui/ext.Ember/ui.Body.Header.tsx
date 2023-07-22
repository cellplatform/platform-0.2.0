import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type HeaderProps = {
  slug?: t.VideoConceptSlug;
  style?: t.CssValue;
};

export const Header: React.FC<HeaderProps> = (props) => {
  const { slug } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      alignContent: 'end',
      boxSizing: 'border-box',
      paddingBottom: 3,
    }),
    title: css({
      fontSize: 12,
    }),
  };

  const elTitle = slug && <div {...styles.title}>{slug.title}</div>;

  return <div {...css(styles.base, props.style)}>{elTitle}</div>;
};
