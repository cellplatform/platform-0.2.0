import { DEFAULTS, css, type t } from './common';
import { Action } from './ui.Action';

export const RightActions: React.FC<t.LabelItemProps> = (props) => {
  const {
    editing = DEFAULTS.editing,
    selected = DEFAULTS.selected,
    focused = DEFAULTS.focused,
  } = props;

  const actions = props.rightActions ?? DEFAULTS.rightActions;
  if (actions.length === 0) return null;

  let enabled = true;
  if (editing) enabled = false;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      columnGap: 5,
    }),
  };

  const elements = actions.map((action, i) => {
    return (
      <Action
        key={`${i}:${action.kind}`}
        action={action}
        enabled={enabled}
        selected={selected}
        focused={focused}
      />
    );
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};
