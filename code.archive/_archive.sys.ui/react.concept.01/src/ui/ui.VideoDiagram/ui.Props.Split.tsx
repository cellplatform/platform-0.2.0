import { Layout, type t } from './common';

export type SplitProps = {
  title?: string;
  props?: t.VideoDiagramProps;
  style?: t.CssValue;
  onChange?: t.SplitLayoutEditorChangeHandler;
};

export const Split: React.FC<SplitProps> = (input) => {
  const { props = {}, title = 'split (diagram / video)' } = input;
  return (
    <Layout.Split.PropEditor
      title={title}
      split={props.split}
      splitMin={props.splitMin}
      splitMax={props.splitMax}
      showAxis={false}
      onChange={input.onChange}
    />
  );
};
