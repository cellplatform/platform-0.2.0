import { ConceptSlug } from '../ui.ConceptSlug';
import { COLORS, Color, DEFAULTS, css, type t } from './common';
import { Empty } from './ui.Empty';

export type SlugProps = {
  vimeo?: t.VimeoInstance;
  slug?: t.VideoConceptSlug;
  style?: t.CssValue;
};

export const Slug: React.FC<SlugProps> = (props) => {
  const { slug, vimeo } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: COLORS.WHITE,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.2)}`,
      borderRadius: 4,
      boxSizing: 'border-box',
      boxShadow: `0 1px 30px 5px ${Color.format(-0.06)}`,
      display: 'grid',
    }),
  };

  console.log('slug.video', slug?.video);

  const elEmpty = !slug && <Empty text={DEFAULTS.text.nothingSelected} />;
  const elSlug = slug && <ConceptSlug video={slug.video} vimeo={vimeo} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elSlug}
    </div>
  );
};
