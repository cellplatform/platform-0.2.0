import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, Dev, MonacoEditor } from './common';

export type DevEditorProps = {
  name: string;
  style?: t.CssValue;
  onReady?: t.MonacoEditorReadyHandler;
};

export const DevEditor: React.FC<DevEditorProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({ display: 'grid', gridTemplateColumns: '1fr 1fr' }),
    left: css({ borderRight: `solid 1px ${Color.format(-0.1)}`, display: 'grid' }),
    right: css({ padding: 15 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <MonacoEditor onReady={props.onReady} />
      </div>
      <div {...styles.right}>
        <div>{props.name}</div>
        <Dev.Object />
      </div>
    </div>
  );
};
