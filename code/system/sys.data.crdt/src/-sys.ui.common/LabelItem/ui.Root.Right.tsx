import { DEFAULTS, type t } from './common';

import { Wrangle } from './Wrangle';
import { Actions } from './ui.Actions';

export const Right: React.FC<t.LabelItemProps> = (props) => {
  const flags = Wrangle.valuesOrDefault(props);
  const action = props.right ?? DEFAULTS.rightAction;
  return <Actions {...flags} edge={'Right'} action={action} />;
};
