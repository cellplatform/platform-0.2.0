import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';
import { MonacoEditor } from '../ui.MonacoEditor';

const source = `
情報革命↩︎
情報革命↲
情報革命↵
`;

export const View: React.FC<t.BitextProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
    }),
    divider: css({
      width: 1,
      backgroundColor: Color.alpha(COLORS.DARK, 0.3),
    }),
    container: css({
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.container}>
        <MonacoEditor />
      </div>
      <div {...styles.divider} />
      <div {...styles.container}>
        <MonacoEditor text={source} />
      </div>
    </div>
  );
};
