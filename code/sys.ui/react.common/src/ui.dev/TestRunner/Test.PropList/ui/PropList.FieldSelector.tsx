import { DEFAULTS, FIELDS, PropList, type t } from '../common';

export type PropListFieldSelectorProps = t.PropListFieldSelectorProps<t.TestRunnerField>;

export const PropListFieldSelector: React.FC<PropListFieldSelectorProps> = (props) => {
  const { all = FIELDS, selected = DEFAULTS.fields, theme } = props;
  return <PropList.FieldSelector {...props} all={all} selected={selected} theme={theme} />;
};
