import { useState } from 'react';

import { Color, COLORS, css, DEFAULTS, t } from '../common';
import { Icons } from '../Icons.mjs';
import { MarkdownDoc } from '../Markdown.Doc';
import { useTriggerClickHandler } from './useTriggerClickHandler.mjs';

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
  const click = useTriggerClickHandler({ instance, def, md });

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
    <div {...css(styles.base, props.style)} ref={click.ref}>
      {elHeader}
      {elBody}
    </div>
  );
};
