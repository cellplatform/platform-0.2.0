import { PlayBar, css, type t } from './common';

export type FooterProps = {
  vimeo?: t.VimeoInstance;
  slug?: t.ConceptSlug;
  style?: t.CssValue;
  onPlayToggle?: t.PlayBarHandler;
  onPlayComplete?: t.PlayBarHandler;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { vimeo, slug } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      paddingTop: 5,
      paddingBottom: 10,
      PaddingX: 8,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <PlayBar
        vimeo={vimeo}
        slug={slug}
        onPlayToggle={props.onPlayToggle}
        onPlayComplete={props.onPlayComplete}
        download={slug?.download}
      />
    </div>
  );
};
