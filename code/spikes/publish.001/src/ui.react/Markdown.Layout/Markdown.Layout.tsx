import { Color, COLORS, css, FC, t } from '../common';
import { MarkdownDoc } from '../Markdown.Doc/index.mjs';
import { HeadingTileClickHandler, TileOutline } from '../Tile.Outline/index.mjs';
import { TooSmall } from './TooSmall';
import { OverlayFrame } from '../Overlay';

export type MarkdownLayoutProps = {
  markdown?: { outline?: string; document?: string };
  selectedUrl?: string;
  version?: string;
  style?: t.CssValue;
  onSelectClick?: HeadingTileClickHandler;
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
    footer: {
      base: css({}),
      inner: css({ height: 100 }),
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
        <TileOutline
          widths={{ root: 250, child: 300 }}
          markdown={props.markdown?.outline}
          selectedUrl={props.selectedUrl}
          onClick={props.onSelectClick}
        />
      </div>
      <div {...styles.body.main}>
        <MarkdownDoc markdown={props.markdown?.document} />
      </div>
    </div>
  );

  const elFooter = (
    <div {...styles.footer.base}>
      <div {...styles.footer.inner} />
    </div>
  );

  const elTooSmall = <TooSmall style={styles.tooSmall} />;

  const elContent = (
    <div {...styles.content}>
      {elBody}
      {elFooter}
    </div>
  );

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
