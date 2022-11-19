import { css, DEFAULTS, FC, t } from '../common';
import { useBlockRenderer } from './useBlockRenderer.mjs';
import { useGlobalStyles } from '../Markdown.GlobalStyles';

export type MarkdownDocProps = {
  instance: t.StateInstance;
  markdown?: string;
  renderer?: t.MarkdownDocBlockRenderer;
  paddingBottom?: number;
  style?: t.CssValue;
};

const CLASS = DEFAULTS.MD.CLASS;

const View: React.FC<MarkdownDocProps> = (props) => {
  const { instance, markdown, renderer } = props;
  const { safeBlocks, isEmpty } = useBlockRenderer({ instance, markdown, renderer });
  const globalStyles = useGlobalStyles();

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      width: DEFAULTS.MD.DOC.width,
      color: globalStyles.DocStyles.p.color,
    }),

    empty: css({
      marginTop: 30,
      fontSize: 14,
      fontStyle: 'italic',
      textAlign: 'center',
      opacity: 0.3,
    }),

    blocks: css({}),

    element: {
      htmlBlock: css({}),
      jsxBlock: css({}),
    },

    footerSpacer: css({
      height: props.paddingBottom,
    }),
  };

  const elEmpty = isEmpty && <div {...styles.empty}>{'Nothing to display'}</div>;

  const elHtml = (
    <div {...styles.blocks}>
      {safeBlocks.map((safeHtmlOrElement, i) => {
        if (typeof safeHtmlOrElement === 'string') {
          return (
            <div
              key={i}
              {...styles.element.htmlBlock}
              className={CLASS.BLOCK}
              dangerouslySetInnerHTML={{ __html: safeHtmlOrElement }}
            />
          );
        }

        if (typeof safeHtmlOrElement === 'object')
          return (
            <div key={i} {...styles.element.jsxBlock} className={CLASS.BLOCK}>
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
      {props.paddingBottom && <div {...styles.footerSpacer} />}
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
