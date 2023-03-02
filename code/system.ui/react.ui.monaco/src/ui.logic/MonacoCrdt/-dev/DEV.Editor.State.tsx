import { useEffect, useState } from 'react';
import { Color, COLORS, css, Dev, rx, t } from './common';

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
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
    }),
    title: css({
      userSelect: 'none',
      backgroundColor: Color.alpha(COLORS.DARK, 0.04),
      borderBottom: `solid 1px ${Color.format(-0.03)}`,
      Padding: [3, 7],
    }),
    body: css({ position: 'relative' }),
    inner: css({ Absolute: [10, 15] }),
    codeText: css({
      borderTop: `solid 1px ${Color.format(-0.1)}`,
      marginTop: 20,
    }),
  };

  const codeText = doc.current.code.toString() || '<empty>';

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>{name}</div>
      <div {...styles.body}>
        <div {...styles.inner}>
          <Dev.Object data={doc.current} />
          <div {...styles.codeText}>
            <pre>{codeText}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
