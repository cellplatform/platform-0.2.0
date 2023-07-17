import { Wrangle } from './Wrangle';
import { DEFAULTS, type t } from './common';
import { Actions } from './ui.Actions';

export const Left: React.FC<t.LabelItemProps> = (props) => {

  const flags = Wrangle.flagProps(props);
  const action = props.leftAction ?? DEFAULTS.leftAction; // TODO 🐷 >> make array
  // const actions = [action];
  return <Actions {...flags} edge={'Left'} action={action} />;
};
