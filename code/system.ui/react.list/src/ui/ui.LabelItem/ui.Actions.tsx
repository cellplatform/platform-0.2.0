import { DEFAULTS, asArray, css, type t } from './common';
import { Action } from './ui.Action';

export type ActionsProps = {
  index: number;
  total: number;
  item: t.LabelItem;
  renderers?: t.LabelItemRenderers;

  action?: t.LabelItemAction | t.LabelItemAction[];
  edge: 'Left' | 'Right';
  spacing?: number;

  label?: string;
  enabled?: boolean;
  selected?: boolean;
  focused?: boolean;
  editing?: boolean;
  debug?: boolean;

  style?: t.CssValue;
  onItemClick?: t.LabelItemClickHandler;
  onActionClick?: t.LabelItemActionHandler;
};

export const Actions: React.FC<ActionsProps> = (props) => {
  const {
    index = DEFAULTS.index,
    total = DEFAULTS.total,
    enabled = DEFAULTS.enabled,
    renderers = DEFAULTS.renderers,
  } = props;
  const actions = Wrangle.actions(props);

  /**
   * [Render]
   */
  const styles = {
    base: css({ Flex: 'x-center-center' }),
  };

  const elements = actions.map((action, i) => {
    const margins = Wrangle.actionMargins(props, i);
    return (
      <Action
        key={`${i}:${action.kind}`}
        index={index}
        total={total}
        item={props.item}
        renderers={renderers}
        style={margins}
        action={action}
        enabled={enabled}
        label={props.label}
        selected={props.selected}
        focused={props.focused}
        editing={props.editing}
        debug={props.debug}
        onItemClick={props.onItemClick}
        onActionClick={props.onActionClick}
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
