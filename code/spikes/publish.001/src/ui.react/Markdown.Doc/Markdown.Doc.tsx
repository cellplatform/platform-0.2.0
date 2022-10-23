import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';

export type MarkdownDocProps = {
  markdown?: string;
  scroll?: boolean;

  style?: t.CssValue;
};

export const MarkdownDoc: React.FC<MarkdownDocProps> = (props) => {
  const { markdown } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Scroll: props.scroll,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 40,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <pre>{markdown}</pre>
    </div>
  );
};
