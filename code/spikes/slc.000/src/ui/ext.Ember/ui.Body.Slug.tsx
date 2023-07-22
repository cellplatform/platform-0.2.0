import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from '../common';
import { Empty } from './ui.Empty';

export type SlugProps = {
  slug?: t.VideoConceptSlug;
  style?: t.CssValue;
};

export const Slug: React.FC<SlugProps> = (props) => {
  const { slug } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: COLORS.WHITE,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.15)}`,
      borderRadius: 3,
      boxSizing: 'border-box',
      boxShadow: `0 1px 30px 5px ${Color.format(-0.06)}`,
    }),
  };

  const elEmpty = !slug && <Empty text={'Nothing selected.'} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      <div></div>
    </div>
  );
};
