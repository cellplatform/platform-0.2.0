import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, Dev, MonacoEditor } from './common';

export type DevEditorProps = {
  name: string;
  doc: t.CrdtDocRef<t.SampleDoc>;
  style?: t.CssValue;
  onReady?: t.MonacoEditorReadyHandler;
};

export const DevEditor: React.FC<DevEditorProps> = (props) => {
  const { name, doc } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({ display: 'grid', gridTemplateColumns: '1fr 1fr' }),
    left: css({ borderRight: `solid 1px ${Color.format(-0.1)}`, display: 'grid' }),
    right: css({ padding: 5 }),
    title: css({
      marginBottom: 8,
      backgroundColor: Color.alpha(COLORS.DARK, 0.06),
      Padding: [3, 7],
    }),
    body: css({ Padding: [10, 15] }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <MonacoEditor onReady={props.onReady} />
      </div>
      <div {...styles.right}>
        <div {...styles.title}>{name}</div>
        <div {...styles.body}>
          <Dev.Object data={doc.current} />
        </div>
      </div>
    </div>
  );
};
