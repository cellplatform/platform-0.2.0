import { Color, COLORS, css, t } from '../common';
import { MarkdownDoc } from '../Markdown.Doc/index.mjs';
import { TooSmall } from './TooSmall';
import { OverlayFrame } from '../Overlay';
import { MarkdownLayoutOutline } from './Markdown.Layout.Outline';

export type MarkdownLayoutProps = {
  markdown?: { outline?: string; document?: string };
  selectedUrl?: string;
  version?: string;
  style?: t.CssValue;
  onSelectClick?: t.TileClickHandler;
};

export const MarkdownLayout: React.FC<MarkdownLayoutProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),

    content: css({
      Absolute: 0,
      Flex: 'x-start-stretch',
    }),

    body: {
      base: css({
        Flex: 'x-stretch-stretch',
        backgroundColor: COLORS.WHITE,
        borderRight: `solid 1px ${Color.format(-0.1)}`,
        '@media (max-width: 1100px)': { opacity: 0.1, pointerEvents: 'none' },
      }),
      left: css({
        position: 'relative',
        Scroll: true,
        paddingLeft: 20,
        paddingTop: 20,
        paddingRight: 30,
        paddingBottom: 50,
      }),
      main: css({
        position: 'relative',
        Scroll: true,
        padding: 20,
        paddingLeft: 30,
        paddingRight: 60,
        boxSizing: 'border-box',
      }),
    },

    tooSmall: css({
      '@media (min-width: 1100px)': { display: 'none' },
      pointerEvents: 'none',
      Absolute: 0,
    }),
  };

  const elBody = (
    <div {...styles.body.base}>
      <div {...styles.body.left}>
        <MarkdownLayoutOutline
          markdown={props.markdown?.outline}
          selectedUrl={props.selectedUrl}
          onSelectClick={props.onSelectClick}
        />
      </div>
      <div {...styles.body.main}>
        <MarkdownDoc markdown={props.markdown?.document} />
      </div>
    </div>
  );

  const elTooSmall = <TooSmall style={styles.tooSmall} />;
  const elContent = <div {...styles.content}>{elBody}</div>;

  const elOverlays = (
    <div>
      {elTooSmall}

      {/* TEMP 🐷 */}
      {/* <OverlayFrame style={{ Absolute: 0 }} /> */}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elContent}
      {elOverlays}
    </div>
  );
};
