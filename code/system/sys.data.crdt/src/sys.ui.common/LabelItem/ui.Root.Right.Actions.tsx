import { DEFAULTS, css, type t } from './common';

import { Action } from './ui.Action';

export const RightActions: React.FC<t.LabelItemProps> = (props) => {
  const {
    editing = DEFAULTS.editing,
    rightActions = DEFAULTS.rightActions,
    selected = DEFAULTS.selected,
  } = props;

  let enabled = true;
  if (editing) enabled = false;
  if (rightActions.length === 0) return null;

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

  const elements = rightActions.map((action, i) => {
    const key = `${i}:${action.kind}`;
    return <Action key={key} action={action} enabled={enabled} selected={selected} />;
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};
