import React, { useEffect } from 'react';

import { css, FC, Style, t, DEFAULTS } from '../common';
import { DocStyles } from './Global.Styles.mjs';
import { useBlockRenderer } from './useBlockRenderer';

export type MarkdownDocProps = {
  markdown?: string;
  scroll?: boolean;
  renderer?: t.MarkdownDocBlockRenderer;
  style?: t.CssValue;
};

const View: React.FC<MarkdownDocProps> = (props) => {
  const { markdown, renderer } = props;
  const { safeBlocks, isEmpty } = useBlockRenderer({ markdown, renderer });
  const CLASS = DEFAULTS.MD.CLASS;

  /**
   * Lifecycle
   */
  useEffect(() => {
    /**
     * Initial Load.
     */
    const prefix = `.${CLASS.ROOT} .${CLASS.BLOCK}`;
    Style.global(DocStyles, { prefix });
  }, []);

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
            <div key={i} {...styles.jsxElementBlock}>
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
