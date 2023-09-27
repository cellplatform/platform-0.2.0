import { Button, css, useDocument, type t } from './-common';

export type SampleProps = {
  docUri: t.DocUri;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const [doc, changeDoc] = useDocument<t.SampleDoc>(props.docUri);

  const increment = () => {
    changeDoc((d: any) => d.count?.increment(1));
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ padding: 10 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>count: {doc?.count?.value ?? 0}</div>
      <Button.Blue label={'increment'} onClick={increment} />
    </div>
  );
};
