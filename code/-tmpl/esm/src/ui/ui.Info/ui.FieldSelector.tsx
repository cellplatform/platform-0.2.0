import { DEFAULTS, PropList, type t } from './common';

type P = t.PropListFieldSelectorProps;
export type FieldSelectorProps = Omit<P, 'all'> & {};

export const FieldSelector: React.FC<FieldSelectorProps> = (props) => {
  return <PropList.FieldSelector {...props} all={DEFAULTS.fields.all} />;
};
