import { Button, css, useDocument, type t } from './common';

export type SampleProps = {
  user?: string;
  docUri?: t.DocUri;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const [doc, changeDoc] = useDocument<t.SampleDoc>(props.docUri);

  const increment = () => {
    changeDoc((d: any) => d.count?.increment(1));
  };

  const styles = {
    base: css({ padding: 10, lineHeight: 1.5 }),
    user: css({ fontWeight: 'bold' }),
    icon: css({ opacity: props.user ? 1 : 0.3, marginRight: 5 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.user}>
        <span {...styles.icon}>🌳</span>
        <span>{props.user && `network ${props.user}`}</span>
      </div>
      <div>count: {doc?.count?.value ?? 0}</div>
      <Button.Blue label={'increment'} onClick={increment} />
    </div>
  );
};
