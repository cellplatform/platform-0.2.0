import { DEFAULTS, FIELDS, PropList, t } from '../common';

export type PropListFieldSelectorProps = t.PropListFieldSelectorProps<t.TestRunnerField>;

export const PropListFieldSelector: React.FC<PropListFieldSelectorProps> = (props) => {
  const { all = FIELDS, selected = DEFAULTS.fields } = props;
  return <PropList.FieldSelector {...props} all={all} selected={selected} />;
};
