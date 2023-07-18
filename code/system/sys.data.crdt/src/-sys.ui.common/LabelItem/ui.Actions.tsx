import { DEFAULTS, asArray, css, type t } from './common';
import { Action } from './ui.Action';

export type ActionsProps = {
  action?: t.LabelAction | t.LabelAction[];
  edge: 'Left' | 'Right';
  spacing?: number;

  label?: string;
  enabled?: boolean;
  selected?: boolean;
  focused?: boolean;
  editing?: boolean;

  style?: t.CssValue;
};

export const Actions: React.FC<ActionsProps> = (props) => {
  const { selected, focused, editing, label, enabled = DEFAULTS.enabled } = props;
  const actions = Wrangle.actions(props);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      Flex: 'x-center-center',
    }),
  };

  const elements = actions.map((action, i) => {
    const margins = Wrangle.actionMargins(props, i);
    return (
      <Action
        key={`${i}:${action.kind}`}
        style={margins}
        action={action}
        label={label}
        enabled={enabled}
        selected={selected}
        focused={focused}
        editing={editing}
      />
    );
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};

/**
 * Helpers
 */
const Wrangle = {
  actions(props: ActionsProps) {
    return props.action ? asArray(props.action) : [];
  },

  actionMargins(props: ActionsProps, index: number) {
    const { edge, spacing = 5 } = props;
    const actions = Wrangle.actions(props);
    const is = {
      first: index === 0,
      last: index === actions.length - 1,
    };

    let marginLeft = 0;
    let marginRight = 0;

    if (edge === 'Right' && !is.first) marginLeft = spacing;
    if (edge === 'Left' && !is.last) marginRight = spacing;

    return { marginLeft, marginRight };
  },
} as const;
