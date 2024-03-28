import { useEffect, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, Processor, t } from '../../common';

export type DocSidebarProps = {
  def: t.DocSidebarYaml;
  style?: t.CssValue;
};

export const DocSidebar: React.FC<DocSidebarProps> = (props) => {
  const { def } = props;
  const { margin = {} } = def;
  const title = Wrangle.title(def.title);

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
  const titleBorder = `solid 5px ${Color.alpha(COLORS.DARK, 0.1)}`;

  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.alpha(COLORS.DARK, 0.01),
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      borderLeft: `solid 10px ${COLORS.MAGENTA}`,
      marginLeft: 30,
      marginTop: margin.top,
      marginBottom: margin.bottom,
      Flex: 'y-stretch-stretch',
    }),
    html: css({
      position: 'relative',
      margin: 30,
    }),
    title: {
      base: css({
        Flex: 'x-spaceBetween-stretch',
        MarginX: 10,
      }),
      header: css({ borderBottom: titleBorder }),
      footer: css({ borderTop: titleBorder }),
      text: css({
        fontSize: 18,
        color: COLORS.MAGENTA,
        textTransform: 'uppercase',
        fontWeight: 600,
        PaddingY: 8,
      }),
    },
  };

  const elHeader = (title.topLeft || title.topRight) && (
    <div {...css(styles.title.base, styles.title.header)}>
      <div {...styles.title.text}>{title.topLeft}</div>
      <div {...styles.title.text}>{title.topRight}</div>
    </div>
  );
  const elFooter = (title.bottomLeft || title.bottomRight) && (
    <div {...css(styles.title.base, styles.title.footer)}>
      <div {...styles.title.text}>{title.bottomLeft}</div>
      <div {...styles.title.text}>{title.bottomRight}</div>
    </div>
  );

  const elHtml = (
    <div
      {...styles.html}
      className={DEFAULTS.MD.CLASS.SIDEBAR}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elHeader}
      {elHtml}
      {elFooter}
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  title(input?: t.DocSidebarYaml['title']): t.DocSidebarTitle {
    if (!input) return {};
    if (typeof input === 'string') return { topLeft: input };
    if (typeof input === 'object') return input;
    return {};
  },
};
