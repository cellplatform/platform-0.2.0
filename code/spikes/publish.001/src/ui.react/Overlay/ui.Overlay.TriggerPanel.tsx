import { useEffect, useRef, useState } from 'react';

import { Color, COLORS, css, DEFAULTS, State, t } from '../common';
import { Icons } from '../Icons.mjs';
import { MarkdownDoc } from '../Markdown.Doc';

const CLASS = DEFAULTS.MD.CLASS;

export type OverlayTriggerPanelProps = {
  instance: t.Instance;
  def: t.OverlayDef;
  style?: t.CssValue;
};

export const OverlayTriggerPanel: React.FC<OverlayTriggerPanelProps> = (props) => {
  const { instance, def } = props;
  const { margin = {} } = def;

  const baseRef = useRef<HTMLDivElement>(null);
  const [md, setMd] = useState<t.ProcessedMdast | undefined>();
  const [isOver, setOver] = useState(false);
  const over = (isOver: boolean) => () => setOver(isOver);

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const events = State.Bus.Events({ instance });

    /**
     * Intercept node click events looking for
     * activation links to open the popup with.
     */
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLAnchorElement;
      if (!baseRef.current || el === null || !md) return;
      if (!baseRef.current.contains(el)) return;
      if (el.tagName.toUpperCase() !== 'A') return;
      e.preventDefault();

      const base = location.pathname;
      const source = el.pathname.substring(base.length);
      events.overlay.def(def, source);
    };

    /**
     * Init/Dispose.
     */
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
      events.dispose();
    };
  }, [md?.markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.alpha(COLORS.DARK, 0.02),
      borderRadius: 6,

      MarginX: 60,
      marginTop: margin.top,
      marginBottom: margin.bottom,

      border: `solid 1px`,
      borderColor: `${Color.alpha(COLORS.DARK, 0.15)}`,
      // borderColor: `${Color.alpha(COLORS.DARK, isOver ? 0.2 : 0.1)}`,
      // boxShadow: `0 0 10px 0 ${Color.alpha(COLORS.DARK, isOver ? 0.02 : 0)}`,
      // transition: `border-color 500ms, box-shadow 300ms`,
    }),
    header: css({
      userSelect: 'none',
      Padding: [12, 15, 12, 18],
      backgroundColor: Color.format(0.7),
      borderBottom: `solid 1px ${Color.format(-0.12)}`,
      Flex: 'x-spaceBetween-stretch',
    }),
    headerLeft: css({}),
    headerRight: css({}),
    title: css({
      Flex: 'x-center-center',
      paddingTop: 4,
      fontWeight: 'bold',
    }),
    icon: css({
      position: 'relative',
      top: -4,
      marginRight: 8,
    }),

    body: css({
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      PaddingX: 50,
      paddingBottom: 40,
    }),
    iconWatermark: css({
      Absolute: [-260, null, null, -250],
      transform: `rotate(8deg)`,
    }),
    html: css({
      //
    }),
  };

  const elHeader = (
    <div {...styles.header}>
      <div {...styles.headerLeft}>
        <div {...styles.title}>
          <span>{def.title ?? 'Untitled'}</span>
        </div>
      </div>
      <div {...styles.headerRight}>
        <div>{/* RIGHT */}</div>
      </div>
    </div>
  );

  const elBody = (
    <div {...styles.body}>
      <Icons.Support
        size={620}
        style={styles.iconWatermark}
        color={Color.alpha(COLORS.DARK, 0.04)}
      />
      <MarkdownDoc
        instance={instance}
        markdown={def.detail}
        className={CLASS.TIGGER_PANEL}
        onParsed={(e) => setMd(e.md)}
      />
    </div>
  );

  return (
    <div
      {...css(styles.base, props.style)}
      ref={baseRef}
      onMouseEnter={over(true)}
      onMouseLeave={over(false)}
    >
      {elHeader}
      {elBody}
    </div>
  );
};
