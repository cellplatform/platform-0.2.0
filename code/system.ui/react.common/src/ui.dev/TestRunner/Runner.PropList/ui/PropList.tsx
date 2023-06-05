import { PropList as Base, DEFAULTS, type t } from '../common';
import { FieldTestsRun } from '../fields/TestsRun';
import { FieldTestsSelector, FieldTestsSelectorReset } from '../fields/TestsSelector';
import { useSpecsImport } from '../hooks/useSpecsImport.mjs';

export type TestPropListProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.TestRunnerField[];
  data?: t.TestRunnerPropListData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  style?: t.CssValue;
};

export const PropList: React.FC<TestPropListProps> = (props) => {
  const { data = {}, fields = DEFAULTS.fields } = props;
  const { pkg } = data;
  const { suites } = useSpecsImport(data);

  const items = Base.builder<t.TestRunnerField>()
    .field('Module', { label: 'Module', value: pkg?.name ?? '-' })
    .field('Module.Version', { label: 'Version', value: pkg?.version ?? '-' })
    .field('Tests.Run', () => FieldTestsRun({ fields, data }))
    .field('Tests.Selector', () => FieldTestsSelector({ fields, data, suites }))
    .field('Tests.Selector.Reset', () => FieldTestsSelectorReset({ fields, data }))
    .items(fields);

  return (
    <Base
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      card={props.card}
      flipped={props.flipped}
      padding={props.card ? [20, 25, 20, 25] : undefined}
      margin={props.margin}
      style={props.style}
    />
  );
};

/**
 * Helpers
 */

const Wrangle = {
  title(props: TestPropListProps) {
    const title = Base.Wrangle.title(props.title);
    if (!title.margin && props.card) title.margin = [0, 0, 15, 0];
    return title;
  },
};
