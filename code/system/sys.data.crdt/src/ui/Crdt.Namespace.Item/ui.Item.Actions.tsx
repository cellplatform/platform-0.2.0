import { DEFAULTS, css, type t } from './common';

import { Wrangle } from './Wrangle';
import { Icon } from './ui.Item.Icon';

export const Actions: React.FC<t.CrdtNamespaceItemProps> = (props) => {
  const { editing = DEFAULTS.editing } = props;
  const opacity = editing ? 0.4 : 1;

  let enabled = true;
  if (editing) enabled = false;

  /**
   * [Handlers]
   */
  const onClick = (...actions: t.CrdtNsItemActionKind[]) => {
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

  const icon = (kind: t.CrdtNsItemActionKind) => {
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
