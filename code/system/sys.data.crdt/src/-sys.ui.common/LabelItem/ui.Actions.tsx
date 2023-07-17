import { css, type t, asArray } from './common';
import { Action } from './ui.Action';

export type ActionsProps = {
  action?: t.LabelAction | t.LabelAction[];
  edge: 'Left' | 'Right';
  spacing?: number;

  enabled?: boolean;
  editing?: boolean;
  selected?: boolean;
  focused?: boolean;

  style?: t.CssValue;
};

export const Actions: React.FC<ActionsProps> = (props) => {
  const { selected, focused, enabled = true } = props;
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
        action={action}
        enabled={enabled}
        selected={selected}
        focused={focused}
        style={margins}
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
};
