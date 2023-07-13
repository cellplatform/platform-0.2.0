import { Wrangle } from './Wrangle';
import { DEFAULTS, type t } from './common';
import { Icon } from './ui.Icon';

export const LeftIcon: React.FC<t.LabelItemProps> = (props) => {
  const { editing = DEFAULTS.editing } = props;
  const { hasValue } = Wrangle.text(props);
  const foreColor = Wrangle.foreColor(props);

  let opacity = 0.5;
  if (hasValue) opacity = 1;
  if (editing) opacity = 1;

  return (
    <Icon
      //
      width={18}
      action={editing ? 'Editing' : 'Repo'}
      color={foreColor}
      opacity={opacity}
    />
  );
};
