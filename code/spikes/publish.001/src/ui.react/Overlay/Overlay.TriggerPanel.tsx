import { useEffect, useRef, useState } from 'react';
import { Processor, Color, COLORS, css, t, rx, FC } from '../common';

export type OverlayTriggerPanelProps = {
  def: t.DocOverlayDef;
  style?: t.CssValue;
};

export const OverlayTriggerPanel: React.FC<OverlayTriggerPanelProps> = (props) => {
  const { def } = props;
  const { margin = {} } = def;
  const [detailHtml, setDetailHtml] = useState('');

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
      marginTop: margin.top,
      marginBottom: margin.bottom,
      backgroundColor: Color.alpha(COLORS.DARK, 0.06),
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      borderRadius: 6,
    }),
    right: css({
      flex: 1,
      PaddingX: 30,
    }),
    detail: css({
      //
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.right}>
        <div {...styles.detail} dangerouslySetInnerHTML={{ __html: detailHtml }} />
      </div>
    </div>
  );
};
