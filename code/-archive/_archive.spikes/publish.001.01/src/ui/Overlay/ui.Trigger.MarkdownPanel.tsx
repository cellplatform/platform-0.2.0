import { useState } from 'react';

import { Color, COLORS, css, DEFAULTS, t } from '../common';
import { Icons } from '../Icons.mjs';
import { MarkdownDoc } from '../Markdown.Doc';
import { useMarkdownLinkClick } from './useMarkdownLinkClick.mjs';

const CLASS = DEFAULTS.MD.CLASS;

export type OverlayTriggerPanelProps = {
  instance: t.Instance;
  def: t.OverlayDef;
  style?: t.CssValue;
};

export const OverlayTriggerPanel: React.FC<OverlayTriggerPanelProps> = (props) => {
  const { instance, def } = props;
  const { margin = {} } = def;

  const [md, setMd] = useState<t.ProcessedMdast | undefined>();
  const click = useMarkdownLinkClick({ instance, def, md });

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
      overflow: 'hidden',
    }),

    main: css({
      Absolute: 0,
      borderRadius: 6,
    }),

    header: css({
      userSelect: 'none',
      Padding: [12, 15, 12, 18],
      backgroundColor: Color.format(0.4),
      backdropFilter: `blur(10px)`,
      borderBottom: `solid 1px ${Color.format(-0.12)}`,
      Flex: 'x-spaceBetween-stretch',
    }),
    headerLeft: css({
      display: 'grid',
      alignContent: 'center',
      justifyContent: 'start',
    }),
    headerRight: css({
      display: 'grid',
      alignContent: 'center',
      justifyContent: 'start',
    }),

    title: css({
      Flex: 'x-center-center',
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
      paddingTop: 0,
      PaddingX: 20,
      paddingBottom: 40,
    }),
    watermark: css({
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
        <Icons.Video.Library size={26} color={Color.darken(COLORS.RED, 2)} />
      </div>
    </div>
  );

  const elWatermark = (
    <Icons.Support size={620} style={styles.watermark} color={Color.alpha(COLORS.DARK, 0.04)} />
  );

  const elBody = (
    <div {...styles.body}>
      <MarkdownDoc
        instance={instance}
        markdown={def.markdown}
        className={CLASS.TIGGER_PANEL}
        onParsed={(e) => setMd(e.md)}
      />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)} ref={click.ref}>
      {elWatermark}
      {elHeader}
      {elBody}
    </div>
  );
};
