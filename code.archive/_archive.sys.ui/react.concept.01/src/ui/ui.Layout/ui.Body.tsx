import { Grid, css, type t } from './common';
import { Footer } from './ui.Body.Footer';
import { Header } from './ui.Body.Header';
import { Main } from './ui.Main';

export type BodyProps = {
  slugs?: t.SlugListItem[];
  selected?: number;
  video?: t.LayoutVideoState;
  style?: t.CssValue;
  onVideo?: t.LayoutVideoHandler;
};

export const Body: React.FC<BodyProps> = (props) => {
  const { slugs = [], selected = -1, video, onVideo } = props;
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
          if (e.index === 0) return '40px';
          return e.index === 1 ? 1 : '50px';
        },
        row(e) {
          if (e.index === 0) return '40px';
          if (e.index === 2) return '55px';
          return 1; // 1fr.
        },
        cell(e) {
          const { x, y } = e;
          if (x === 1) {
            if (y === 0) return <Header slug={slug} />;
            if (y === 1) return <Main slug={slug} video={video} onVideo={onVideo} />;
            if (y === 2) return <Footer slug={slug} video={video} onVideo={onVideo} />;
          }
          return;
        },
      }}
    />
  );

  return <div {...css(styles.base, props.style)}>{elLayout}</div>;
};
