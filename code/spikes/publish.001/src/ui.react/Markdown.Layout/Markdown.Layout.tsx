import { Color, COLORS, css, t } from '../common';
import { MarkdownDoc } from '../Markdown.Doc';
import { TooSmall } from '../TooSmall';
import { OverlayFrame } from '../Overlay';
import { MarkdownLayoutOutline } from './Markdown.Layout.Outline';

export type MarkdownLayoutProps = {
  instance: t.StateInstance;
  markdown?: { outline?: string; document?: string };
  overlay?: t.OverlayDef;
  selectedUrl?: string;
  version?: string;
  style?: t.CssValue;
  onSelectClick?: t.TileClickHandler;
};

export const MarkdownLayout: React.FC<MarkdownLayoutProps> = (props) => {
  const { instance, overlay } = props;

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

    overlay: {
      base: css({}),
      frame: css({ Absolute: 0 }),
      tooSmall: css({
        '@media (min-width: 1100px)': { display: 'none' },
        pointerEvents: 'none',
        Absolute: 0,
      }),
    },
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
        <MarkdownDoc instance={instance} markdown={props.markdown?.document} />
      </div>
    </div>
  );

  const elContent = <div {...styles.content}>{elBody}</div>;
  const elOverlays = (
    <div {...styles.overlay.base}>
      {overlay && <OverlayFrame def={overlay} instance={instance} style={styles.overlay.frame} />}
      <TooSmall style={styles.overlay.tooSmall} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elContent}
      {elOverlays}
    </div>
  );
};
