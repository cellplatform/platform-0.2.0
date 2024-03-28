import { COLORS, css, t } from '../common';
import { Body } from './ui.Body';
import { Footer } from './ui.Footer';
import { Header } from './ui.Header';

export type PlaylistProps = {
  title?: string;
  subtitle?: string;
  preview?: t.PlaylistPreview;
  items?: t.PlaylistItem[];
  style?: t.CssValue;
  onClick?: t.PlaylistItemClickHandler;
};

export const Playlist: React.FC<PlaylistProps> = (props) => {
  const { title = 'Untitled List' } = props;
  const totalSecs = Wrangle.totalSeconds(props.items);

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
      <Header title={title} subtitle={props.subtitle} preview={props.preview} />
      <Body items={props.items} onClick={props.onClick} />
      <Footer totalSecs={totalSecs} />
    </div>
  );
};

/**
 * Helpers
 */

const Wrangle = {
  totalSeconds(items?: t.PlaylistItem[]) {
    return (items ?? []).reduce((acc, next) => acc + (next.secs ?? 0), 0);
  },
};
