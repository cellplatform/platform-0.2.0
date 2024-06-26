import { useEffect, useState } from 'react';
import { Button, css, type t } from './common';

export type SampleProps = {
  user?: string;
  doc?: t.Doc<t.SampleDoc>;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const { doc } = props;
  const count = doc?.current.count?.value ?? 0;

  const [, setRedraw] = useState(0);
  const redraw = () => setRedraw((n) => n + 1);

  /**
   * Redraw
   */
  useEffect(() => {
    const events = doc?.events();
    events?.changed$.subscribe(redraw);
    return events?.dispose;
  }, []);

  const increment = () => {
    doc?.change((d) => d.count?.increment(1));
  };

  /**
   * Render
   */
  const styles = {
    base: css({ Padding: [10, 12], lineHeight: 1.5 }),
    body: css({ display: 'grid' }),
    title: css({ fontWeight: 'bold' }),
    icon: css({ opacity: props.user ? 1 : 0.3, marginRight: 5 }),
    right: css({
      display: 'grid',
      placeItems: 'center',
      fontSize: 64,
      fontWeight: 900,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>
        <span {...styles.icon}>🌳</span>
        <span>{props.user && `network ${props.user}`}</span>
      </div>
      <div {...styles.body}>
        <div>count: {count}</div>
        <Button.Blue label={'increment'} onClick={increment} />
      </div>
    </div>
  );
};
