import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Grid } from './common';

import { Slug } from './ui.Body.Slug';
import { Header } from './ui.Body.Header';
import { Footer } from './ui.Body.Footer';

export type BodyProps = {
  slugs?: t.VideoConceptSlug[];
  selected?: number;
  style?: t.CssValue;
};

export const Body: React.FC<BodyProps> = (props) => {
  const { slugs = [], selected = -1 } = props;
  const slug = slugs[selected];

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      userSelect: 'none',
      display: 'grid',
    }),
  };

  const elLayout = (
    <Grid
      config={{
        total: 3,
        column(e) {
          if (e.index === 0) return '15px';
          return e.index === 1 ? 1 : '50px';
        },
        row(e) {
          if (e.index === 2) return '60px';
          return e.index === 1 ? 1 : '50px';
        },
        cell(e) {
          const { x, y } = e;
          if (x === 1) {
            if (y === 0) return <Header slug={slug} />;
            if (y === 1) return <Slug slug={slug} />;
            if (y === 2) return <Footer slug={slug} />;
          }
          return;
        },
      }}
    />
  );

  return <div {...css(styles.base, props.style)}>{elLayout}</div>;
};
