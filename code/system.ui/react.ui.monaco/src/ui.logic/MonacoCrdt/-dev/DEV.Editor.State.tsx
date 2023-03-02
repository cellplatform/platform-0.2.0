import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, Dev } from './common';

export type DevEditorStateProps = {
  name: string;
  doc: t.CrdtDocRef<t.SampleDoc>;
  style?: t.CssValue;
};

export const DevEditorState: React.FC<DevEditorStateProps> = (props) => {
  const { name, doc } = props;

  const [_, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    doc.$.pipe(rx.takeUntil(dispose$)).subscribe(redraw);

    return dispose;
  }, [doc.id.actor]);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    title: css({
      marginBottom: 8,
      backgroundColor: Color.alpha(COLORS.DARK, 0.04),
      borderBottom: `solid 1px ${Color.format(-0.03)}`,
      Padding: [3, 7],
    }),
    body: css({ Padding: [8, 15] }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>{name}</div>
      <div {...styles.body}>
        <Dev.Object data={doc.current} />
      </div>
    </div>
  );
};
