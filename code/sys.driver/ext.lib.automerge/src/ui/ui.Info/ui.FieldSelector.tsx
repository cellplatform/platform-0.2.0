import { DEFAULTS, PropList, type t } from './common';

type R = t.PropListFieldSelectorProps;
export type FieldSelectorProps = Omit<R, 'all'> & {};

export const FieldSelector: React.FC<FieldSelectorProps> = (props) => {
  return <PropList.FieldSelector {...props} all={DEFAULTS.fields.all} />;
};
