import { PropList as Base, DEFAULTS, type t } from '../common';
import { FieldTestsRun } from '../fields/TestsRun';
import { FieldTestsSelector } from '../fields/TestsSelector';
import { FieldTestsSelectorReset } from '../fields/TestsSelector.Reset';
import { useKeyboard } from '../hooks/useKeyboard.mjs';
import { useSuites } from '../hooks/useSuites.mjs';

export type TestPropListProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.TestRunnerField[];
  data?: t.TestPropListData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  enabled?: boolean;
  style?: t.CssValue;
};

export const PropList: React.FC<TestPropListProps> = (props) => {
  const { data = {}, enabled = true, fields = DEFAULTS.fields } = props;
  const { pkg } = data;
  const { groups } = useSuites({ data });
  useKeyboard({ data, enabled });

  const items = Base.builder<t.TestRunnerField>()
    .field('Module', { label: 'Module', value: pkg?.name ?? '-' })
    .field('Module.Version', { label: 'Version', value: pkg?.version ?? '-' })
    .field('Tests.Run', () => FieldTestsRun({ fields, data, enabled }))
    .field('Tests.Selector', () => FieldTestsSelector({ fields, data, groups, enabled }))
    .field('Tests.Selector.Reset', () => FieldTestsSelectorReset({ fields, data, groups, enabled }))
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
