import { useEffect, useState } from 'react';
import { Color, COLORS, css, Processor, State, t } from '../common';
import { Icons } from '../Icons.mjs';

export type OverlayTriggerPanelProps = {
  instance: t.StateInstance;
  def: t.OverlayDef;
  style?: t.CssValue;
};

export const OverlayTriggerPanel: React.FC<OverlayTriggerPanelProps> = (props) => {
  const { def, instance } = props;
  const { margin = {} } = def;

  const [detailHtml, setDetailHtml] = useState('');
  const [isOver, setOver] = useState(false);
  const over = (isOver: boolean) => () => setOver(isOver);

  /**
   * Handlers
   */
  const handleClick = () => {
    State.withEvents(instance, async (e) => {
      /**
       * Open Overlay.
       */
      await e.overlay.fire(def);
    });
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    Processor.toHtml(def.detail).then((e) => setDetailHtml(e.html));
  }, [def.detail]);

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
      cursor: 'pointer',

      border: `solid 1px`,
      borderColor: `${Color.alpha(COLORS.DARK, isOver ? 0.2 : 0.1)}`,
      boxShadow: `0 0 10px 0 ${Color.alpha(COLORS.DARK, isOver ? 0.02 : 0)}`,
      transition: `border-color 500ms, box-shadow 300ms`,
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

    button: css({
      userSelect: 'none',
      borderRadius: 5,
      Padding: [6, 40, 4, 40],
      fontSize: 11,
      fontWeight: 600,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      color: COLORS.WHITE,
      backgroundColor: COLORS.BLUE,
    }),
    body: css({
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      PaddingX: 50,
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
        <div {...styles.button}>
          <span>{'OPEN'}</span>
        </div>
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
      <div {...styles.html} dangerouslySetInnerHTML={{ __html: detailHtml }} />
    </div>
  );

  return (
    <div
      {...css(styles.base, props.style)}
      onClick={handleClick}
      onMouseEnter={over(true)}
      onMouseLeave={over(false)}
    >
      {elHeader}
      {elBody}
    </div>
  );
};
