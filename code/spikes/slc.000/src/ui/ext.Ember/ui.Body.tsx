import { Grid, css, type t } from './common';

import { Footer } from './ui.Body.Footer';
import { Header } from './ui.Body.Header';
import { Slug } from './ui.Slug';

export type BodyProps = {
  vimeo?: t.VimeoInstance;
  slugs?: t.ConceptSlug[];
  selected?: number;
  style?: t.CssValue;
};

export const Body: React.FC<BodyProps> = (props) => {
  const { slugs = [], selected = -1, vimeo } = props;
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
          if (e.index === 0) return '45px';
          if (e.index === 2) return '60px';
          return 1; // 1fr
        },
        cell(e) {
          const { x, y } = e;
          if (x === 1) {
            if (y === 0) return <Header slug={slug} vimeo={vimeo} />;
            if (y === 1) return <Slug slug={slug} vimeo={vimeo} />;
            if (y === 2) return <Footer slug={slug} vimeo={vimeo} />;
          }
          return;
        },
      }}
    />
  );

  return <div {...css(styles.base, props.style)}>{elLayout}</div>;
};
