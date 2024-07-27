import { DEFAULTS, PropList, type t } from './common';

type R = t.InfoProps;
export type FieldSelectorProps = Omit<R, 'all'> & {};

export const FieldSelector: React.FC<FieldSelectorProps> = (props) => {
  return <PropList.FieldSelector {...props} all={DEFAULTS.fields.all} />;
};
