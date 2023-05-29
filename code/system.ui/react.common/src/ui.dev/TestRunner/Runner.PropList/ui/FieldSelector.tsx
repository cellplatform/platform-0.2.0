import { DEFAULTS, FIELDS, PropList, t } from '../common';

export type FieldSelectorProps = t.PropListFieldSelectorProps<t.TestRunnerField>;

export const FieldSelector: React.FC<FieldSelectorProps> = (props) => {
  const { all = FIELDS, selected = DEFAULTS.fields } = props;
  return <PropList.FieldSelector {...props} all={all} selected={selected} />;
};
