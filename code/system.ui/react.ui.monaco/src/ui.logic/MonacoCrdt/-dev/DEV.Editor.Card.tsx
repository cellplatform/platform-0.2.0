import { useEffect, useState } from 'react';
import { Color, COLORS, css, Dev, rx, t, Card } from './common';

export type DevEditorCardProps = {
  name: string;
  doc: t.CrdtDocRef<t.SampleDoc>;
  style?: t.CssValue;
};

export const DevEditorCard: React.FC<DevEditorCardProps> = (props) => {
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
      boxSizing: 'border-box',
      position: 'relative',
      display: 'grid',
      color: COLORS.DARK,
    }),
    main: css({
      position: 'relative',
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
    }),
    title: css({
      backgroundColor: Color.alpha(COLORS.DARK, 0.02),
      borderBottom: `solid 1px ${Color.format(-0.2)}`,
      borderRadius: '3px 3px 0 0',
      Padding: [10, 15],
      Flex: 'x-center-spaceBetween',
    }),
    body: css({ position: 'relative', Padding: 20 }),
    codeString: css({
      marginTop: 20,
      borderTop: `dashed 1px ${Color.alpha(COLORS.MAGENTA, 0.3)}`,
      fontSize: 14,
      fontWeight: 600,
      userSelect: 'text',
    }),
  };

  const codeString = (doc.current.code.toString() || '<empty>').substring(0, 150);

  const elMain = (
    <div {...styles.main}>
      <div {...styles.title}>
        <div>{name}</div>
        <div>{'NetworkPeer'}</div>
      </div>
      <div {...styles.body}>
        <Dev.Object data={doc.current} />
        <div {...styles.codeString}>
          <pre>{codeString}</pre>
        </div>
      </div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Card padding={0} margin={40}>
        {elMain}
      </Card>
    </div>
  );
};
