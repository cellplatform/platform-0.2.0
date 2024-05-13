import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, FC, rx, type t } from './common';
import { useDocs } from '.';

export type SampleUseDocsProps = {
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const SampleUseDocs: React.FC<SampleUseDocsProps> = (props) => {
  const {} = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      color: theme.fg,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 Sample`}</div>
    </div>
  );
};
