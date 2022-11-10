import { css, DEFAULTS, FC, t } from '../common';
import { useBlockRenderer } from './useBlockRenderer.mjs';
import { useGlobalStyles } from './useGlobalStyles.mjs';

export type MarkdownDocProps = {
  markdown?: string;
  scroll?: boolean;
  renderer?: t.MarkdownDocBlockRenderer;
  style?: t.CssValue;
};

const CLASS = DEFAULTS.MD.CLASS;

const View: React.FC<MarkdownDocProps> = (props) => {
  const { markdown, renderer } = props;
  const { safeBlocks, isEmpty } = useBlockRenderer({ markdown, renderer });
  useGlobalStyles();

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      Scroll: props.scroll,
      width: DEFAULTS.MD.DOC.width,
      paddingBottom: 80,
    }),
    empty: css({
      marginTop: 30,
      fontSize: 14,
      fontStyle: 'italic',
      textAlign: 'center',
      opacity: 0.3,
    }),
    html: css({}),
    jsxElementBlock: css({}),
  };

  const elEmpty = isEmpty && <div {...styles.empty}>Nothing to display</div>;

  const elHtml = (
    <div>
      {safeBlocks.map((safeHtmlOrElement, i) => {
        if (typeof safeHtmlOrElement === 'string') {
          return (
            <div
              key={i}
              {...styles.html}
              className={CLASS.BLOCK}
              dangerouslySetInnerHTML={{ __html: safeHtmlOrElement }}
            />
          );
        }

        if (typeof safeHtmlOrElement === 'object')
          return (
            <div key={i} {...styles.jsxElementBlock} className={CLASS.BLOCK}>
              {safeHtmlOrElement}
            </div>
          );

        return null;
      })}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)} className={CLASS.ROOT}>
      {elEmpty}
      {elHtml}
    </div>
  );
};

/**
 * Export
 */

type Fields = {};

export const MarkdownDoc = FC.decorate<MarkdownDocProps, Fields>(
  View,
  {},
  { displayName: 'MarkdownDoc' },
);
