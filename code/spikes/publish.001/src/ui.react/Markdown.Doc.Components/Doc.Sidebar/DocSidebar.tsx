import { useEffect, useRef, useState } from 'react';
import { Processor, Color, COLORS, css, t, rx, DEFAULTS } from '../../common';

export type DocSidebarProps = {
  def: t.DocSidebarYaml;
  style?: t.CssValue;
};

export const DocSidebar: React.FC<DocSidebarProps> = (props) => {
  const { def } = props;
  const { margin = {} } = def;

  const [safeHtml, setSafeHtml] = useState('');

  /**
   * Lifecycle
   */
  useEffect(() => {
    const markdown = def.markdown ?? '';
    Processor.toHtml(markdown).then((e) => setSafeHtml(e.html));
  }, [def.markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.alpha(COLORS.DARK, 0.01),
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      borderLeft: `solid 10px ${COLORS.MAGENTA}`,
      padding: 30,
      marginLeft: 30,
      marginTop: margin.top,
      marginBottom: margin.bottom,
    }),
    title: css({
      fontWeight: 600,
      fontSize: 22,
      color: COLORS.MAGENTA,
    }),
    html: css({ position: 'relative' }),
  };

  const elTitle = def.title && <div {...styles.title}>{def.title}</div>;

  const elHtml = (
    <div
      {...styles.html}
      className={DEFAULTS.MD.CLASS.SIDEBAR}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elTitle}
      {elHtml}
    </div>
  );
};
