import { COLORS, Color, DEFAULTS, Empty, css, type t } from './common';

export type SlugProps = {
  slug?: t.ConceptSlug__;
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
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.2)}`,
      boxSizing: 'border-box',
      boxShadow: `0 1px 30px 5px ${Color.format(-0.06)}`,
      borderRadius: 4,
      display: 'grid',
    }),
    VIDEO_DIAGRAM: css({ display: 'grid', placeItems: 'center' }),
  };

  const elEmpty = !slug && <Empty abs={true} message={DEFAULTS.text.nothingSelected} />;
  const elMain = slug && <div {...styles.VIDEO_DIAGRAM}>🐷 VIDEO DIAGRAM</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elMain}
    </div>
  );
};
