import React, { useEffect } from 'react';

import { css, FC, Style, t, DEFAULTS } from '../common';
import { DocStyles } from './Styles.mjs';
import { useBlockRenderer } from './useBlockRenderer';

const LOCAL = {
  CSS: {
    ROOT: 'sys-md-doc',
    BLOCK: 'sys-md-block',
  },
};

export type MarkdownDocProps = {
  markdown?: string;
  scroll?: boolean;
  renderer?: t.MarkdownDocBlockRenderer;
  style?: t.CssValue;
};

const View: React.FC<MarkdownDocProps> = (props) => {
  const { markdown, renderer } = props;
  const { safeBlocks, isEmpty } = useBlockRenderer({ markdown, renderer });

  /**
   * Lifecycle
   */
  useEffect(() => {
    /**
     * Initial Load.
     */
    const prefix = `.${LOCAL.CSS.ROOT} .${LOCAL.CSS.BLOCK}`;
    Style.global(DocStyles, { prefix });
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      Scroll: props.scroll,
      width: DEFAULTS.DOC.width,
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
              className={LOCAL.CSS.BLOCK}
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
    <div {...css(styles.base, props.style)} className={LOCAL.CSS.ROOT}>
      {elEmpty}
      {elHtml}
    </div>
  );
};

/**
 * Export
 */

type Fields = {
  DEFAULT: typeof LOCAL;
};

export const MarkdownDoc = FC.decorate<MarkdownDocProps, Fields>(
  View,
  { DEFAULT: LOCAL },
  { displayName: 'MarkdownDoc' },
);
