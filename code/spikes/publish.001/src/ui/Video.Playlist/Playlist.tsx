import { COLORS, css, t } from '../common';
import { Body } from './ui.Body';
import { Footer } from './ui.Footer';
import { Header } from './ui.Header';

type Url = string;

export type PlaylistProps = {
  title?: string;
  previewImage?: Url;
  previewTitle?: string;
  footerRight?: string | JSX.Element;
  items?: t.PlaylistItem[];
  style?: t.CssValue;
  onClick?: t.PlaylistItemClickHandler;
};

export const Playlist: React.FC<PlaylistProps> = (props) => {
  const { title = 'Untitled Playlist' } = props;

  /**
   * [Render]
   */
  const BORDER = `solid 5px ${COLORS.CYAN}`;
  const styles = {
    base: css({
      borderLeft: BORDER,
      borderRight: BORDER,
      color: COLORS.DARK,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <Header title={title} previewTitle={props.previewTitle} previewImage={props.previewImage} />
      <Body items={props.items} onClick={props.onClick} />
      <Footer footerRight={props.footerRight} />
    </div>
  );
};
