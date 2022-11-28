import { useEffect, useRef } from 'react';

import { Color, COLORS, css, DEFAULTS, t, useSizeObserver } from '../common';
import { MarkdownDoc } from '../Markdown.Doc';
import { OverlayFrame } from '../Overlay';
import { TooSmall } from '../TooSmall';
import { MarkdownLayoutOutline } from './Markdown.Layout.Outline';

export type MarkdownLayoutProps = {
  instance: t.Instance;
  markdown?: { outline?: string; document?: string };
  loading?: { document?: boolean };
  overlay?: t.OverlayDef;
  selectedUrl?: string;
  version?: string;
  style?: t.CssValue;
  onSelectClick?: t.TileClickHandler;
};

export const MarkdownLayout: React.FC<MarkdownLayoutProps> = (props) => {
  const { instance, overlay, loading = {} } = props;

  const size = useSizeObserver();
  const docRef = useRef<HTMLDivElement>(null);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const el = docRef.current;
    if (el) el.scrollTop = 0;
  }, [props.markdown?.document]);

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
        paddingRight: Wrangle.paddingSpacing(size.rect.width),
        display: 'flex',
      }),
      doc: css({
        position: 'relative',
        Scroll: true,
        padding: 20,
        paddingLeft: Wrangle.paddingSpacing(size.rect.width),
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
          parentSize={size.rect}
          markdown={props.markdown?.outline}
          selectedUrl={props.selectedUrl}
          onSelectClick={props.onSelectClick}
        />
      </div>
      <div ref={docRef} {...styles.body.doc}>
        <MarkdownDoc
          instance={instance}
          markdown={props.markdown?.document}
          isLoading={Boolean(loading.document)}
          width={DEFAULTS.MD.DOC.width}
          paddingBottom={120}
        />
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
    <div ref={size.ref} {...css(styles.base, props.style)}>
      {elContent}
      {elOverlays}
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  paddingSpacing(width?: number) {
    if (typeof width !== 'number' || width <= 0) return 30;
    if (width > 1280) return 30;
    return 20;
  },
};
