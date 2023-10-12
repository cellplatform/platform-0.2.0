import { Wrangle } from './Wrangle';
import { DEFAULTS, type t } from './common';
import { Actions } from './ui.Actions';

export const Left: React.FC<t.LabelItemProps> = (props) => {
  const args = Wrangle.valuesOrDefault(props);
  const action = args.item.left === null ? undefined : args.item.left ?? DEFAULTS.leftAction;
  return (
    <Actions
      {...args}
      edge={'Left'}
      action={action}
      debug={props.debug}
      renderers={props.renderers}
      onItemClick={props.onClick}
      onActionClick={props.onActionClick}
    />
  );
};
