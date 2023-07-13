import { DEFAULTS, css, type t } from './common';

import { Wrangle } from './Wrangle';
import { Icon } from './ui.Icon';

export const Actions: React.FC<t.LabelItemProps> = (props) => {
  const { editing = DEFAULTS.editing } = props;
  const opacity = editing ? 0.4 : 1;

  let enabled = true;
  if (editing) enabled = false;

  /**
   * [Handlers]
   */
  const onClick = (...actions: t.LabelItemActionKind[]) => {
    props.onClick?.({ actions });
  };

  /**
   * [Render]
   */
  const color = Wrangle.foreColor(props);
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      columnGap: 5,
    }),
  };

  const icon = (kind: t.LabelItemActionKind) => {
    return (
      <Icon
        action={kind}
        button={true}
        color={color}
        enabled={enabled}
        opacity={opacity}
        onClick={() => onClick(kind)}
      />
    );
  };

  return (
    <div {...css(styles.base, props.style)}>
      {icon('Json')}
      {icon('ObjectTree')}
    </div>
  );
};
