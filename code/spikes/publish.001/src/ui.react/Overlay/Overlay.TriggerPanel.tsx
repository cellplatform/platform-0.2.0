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
    State.withEvents(instance, (e) => {
      /**
       * Open Overlay.
       */
      e.overlay.fire(def);
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
      borderBottom: `solid 6px ${Color.format(-0.08)}`,
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
      border: `solid 1px ${isOver ? COLORS.WHITE : Color.alpha(COLORS.DARK, 0.2)}`,
      backgroundColor: isOver ? COLORS.BLUE : COLORS.WHITE,
      color: isOver ? COLORS.WHITE : Color.alpha(COLORS.DARK, 0.8),
      transition: `background-color 350ms, color 280ms`,
    }),
    body: css({
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      PaddingX: 50,
      // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    iconWatermark: css({
      Absolute: [-250, null, null, -250],
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
        style={styles.iconWatermark}
        size={620}
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
