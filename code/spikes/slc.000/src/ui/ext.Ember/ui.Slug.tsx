import { ConceptSlug } from '../ui.Concept.Slug';
import { COLORS, Color, DEFAULTS, css, type t } from './common';
import { Empty } from './ui.Empty';

export type SlugProps = {
  vimeo?: t.VimeoInstance;
  slug?: t.ConceptSlug;
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
      boxSizing: 'border-box',
      boxShadow: `0 1px 30px 5px ${Color.format(-0.06)}`,
      borderRadius: 4,
      display: 'grid',
    }),
  };

  const elEmpty = !slug && <Empty text={DEFAULTS.text.nothingSelected} />;
  const elSlug = slug && <ConceptSlug slug={slug} vimeo={vimeo} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elSlug}
    </div>
  );
};
