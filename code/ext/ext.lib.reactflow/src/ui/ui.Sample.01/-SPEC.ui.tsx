import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type SampleProps = {
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const {} = props;

  console.log('props', props);

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
      <div>{`🐷 Sample - ${props.theme}`}</div>
    </div>
  );
};
