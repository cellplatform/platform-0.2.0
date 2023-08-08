import { COLORS, Color, DEFAULTS, Empty, css, type t, Is } from './common';
import { VideoDiagram } from '../ui.VideoDiagram';

export type MainProps = {
  slug?: t.SlugListItem;
  video?: t.LayoutVideoState;
  style?: t.CssValue;
  onVideo?: t.LayoutVideoHandler;
};

export const Main: React.FC<MainProps> = (props) => {
  const { slug, video } = props;
  const fireVideo = (next: Partial<t.LayoutVideoState>) => props.onVideo?.({ ...video, ...next });

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: COLORS.WHITE,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.2)}`,
      boxSizing: 'border-box',
      boxShadow: `0 1px 30px 5px ${Color.format(-0.06)}`,
      borderRadius: 4,
      display: 'grid',
    }),
    VIDEO_DIAGRAM: css({ display: 'grid', placeItems: 'center' }),
  };

  const elEmpty = !slug && <Empty abs={true} message={DEFAULTS.text.nothingSelected} />;
  const elMain = Is.slug(slug) && (
    <VideoDiagram
      split={slug.split}
      video={slug.video}
      playing={video?.playing}
      timestamp={video?.timestamp}
      muted={video?.muted}
      debug={false}
      onVideoStatus={(e) => fireVideo({ status: e.status })}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elMain}
    </div>
  );
};
