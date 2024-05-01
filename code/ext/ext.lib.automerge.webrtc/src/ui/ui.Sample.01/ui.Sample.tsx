import { useDocument } from '@automerge/automerge-repo-react-hooks';
import { Button, css, type t } from './common';

export type SampleProps = {
  user?: string;
  docUri?: t.DocUri;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const [doc, changeDoc] = useDocument<t.SampleDoc>(props.docUri);
  const count = doc?.count?.value ?? 0;

  const increment = () => {
    changeDoc((d: any) => d.count?.increment(1));
  };

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
