import { PlayBar, css, type t, Video } from './common';

export type FooterProps = {
  slug?: t.SlugListItem;
  style?: t.CssValue;
  onPlayToggle?: t.PlayBarHandler;
  onPlayComplete?: t.PlayBarHandler;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { slug } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      PaddingX: 8,
      display: 'grid',
      alignItems: 'center',
    }),
    playbar: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Video.PlayBar size={'Medium'} style={styles.playbar} />

      {/* <PlayBar
        slug={slug}
        onPlayToggle={props.onPlayToggle}
        onPlayComplete={props.onPlayComplete}
        download={slug?.download}
      /> */}
    </div>
  );
};
