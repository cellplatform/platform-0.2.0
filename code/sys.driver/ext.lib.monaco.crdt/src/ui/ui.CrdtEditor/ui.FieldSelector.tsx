import { DEFAULTS, PropList, type t } from './common';

type P = t.PropListFieldSelectorProps;
export type FieldSelectorProps = Omit<P, 'all'> & {};

export const FieldSelector: React.FC<FieldSelectorProps> = (props) => {
  const all = DEFAULTS.Panel.Info.fields.all;
  return <PropList.FieldSelector {...props} all={all} />;
};
