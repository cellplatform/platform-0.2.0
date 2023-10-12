import { DEFAULTS, type t } from './common';

import { Wrangle } from './Wrangle';
import { Actions } from './ui.Actions';

export const Right: React.FC<t.LabelItemProps> = (props) => {
  const args = Wrangle.valuesOrDefault(props);
  const action = args.item.right ?? DEFAULTS.rightAction;
  return (
    <Actions
      {...args}
      edge={'Right'}
      action={action}
      debug={props.debug}
      renderers={props.renderers}
      onItemClick={props.onClick}
      onActionClick={props.onActionClick}
    />
  );
};
