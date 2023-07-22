import { Wrangle } from './Wrangle';
import { DEFAULTS, type t } from './common';
import { Actions } from './ui.Actions';

export const Left: React.FC<t.LabelItemProps> = (props) => {
  const flags = Wrangle.valuesOrDefault(props);
  const action = props.left ?? DEFAULTS.leftAction;
  return <Actions {...flags} edge={'Left'} action={action} debug={props.debug} />;
};
