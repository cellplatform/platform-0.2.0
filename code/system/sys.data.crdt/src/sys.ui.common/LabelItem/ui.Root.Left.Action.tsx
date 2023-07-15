import { Wrangle } from './Wrangle';
import { DEFAULTS, type t } from './common';
import { Action } from './ui.Action';

export const LeftAction: React.FC<t.LabelItemProps> = (props) => {
  const { editing = DEFAULTS.editing, selected = DEFAULTS.selected } = props;
  const { hasValue } = Wrangle.labelText(props);
  const action = props.leftAction ?? DEFAULTS.leftAction;

  let opacity = selected ? 0.4 : 0.3;
  if (hasValue) opacity = 1;
  if (editing) opacity = 1;

  let enabled = true;
  if (editing) enabled = false;

  return <Action action={action} enabled={enabled} opacity={opacity} selected={props.selected} />;
};
