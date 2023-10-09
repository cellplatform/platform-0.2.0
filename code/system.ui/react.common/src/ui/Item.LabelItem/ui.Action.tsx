import { Button, css, DEFAULTS, type t } from './common';
import { ActionSpinner } from './ui.Action.Spinner';
import { Wrangle } from './Wrangle';

export type ActionProps = {
  index: number;
  total: number;
  item: t.LabelItem;
  renderers: t.LabelItemRenderers;
  action: t.LabelAction;
  label?: string;
  enabled?: boolean;
  selected?: boolean;
  focused?: boolean;
  editing?: boolean;
  debug?: boolean;
  style?: t.CssValue;
  onClick?: t.LabelItemActionHandler;
};

export const Action: React.FC<ActionProps> = (props) => {
  const { action, selected, focused, editing, debug, index, total, item, renderers } = props;
  const { kind, width } = action;

  const enabled = Wrangle.dynamicValue(action.enabled, props, DEFAULTS.enabled);
  const spinning = Wrangle.dynamicValue(action.spinning, props, false);
  const is = {
    button: Boolean(enabled && (action.button ?? true)),
  } as const;

  /**
   * [Handlers]
   */
  const handleClick = () =>
    props.onClick?.({
      kind,
      position: { index, total },
      focused: Boolean(focused),
      selected: Boolean(selected),
      editing: Boolean(editing),
    });

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      pointerEvents: spinning ? 'none' : 'auto',
      backgroundColor: debug ? DEFAULTS.RUBY : undefined,
      width,
      display: 'grid',
    }),
    body: css({
      width,
      display: 'grid',
      placeItems: 'center',
      opacity: spinning ? 0 : 1,
      transition: 'opacity 0.2s',
    }),
    button: css({ display: 'grid' }),
  };

  const renderer = Wrangle.renderer(renderers, kind);
  const elBody = Wrangle.icon(renderer, {
    index,
    total,
    selected,
    enabled,
    focused,
    editing,
    item,
  });

  const elButton = is.button && (
    <Button
      onMouseDown={(e) => e.stopPropagation()}
      onClick={handleClick}
      enabled={enabled}
      disabledOpacity={1}
    >
      <div {...styles.button}>{elBody}</div>
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>{elButton || elBody}</div>
      {spinning && <ActionSpinner action={action} selected={selected} focused={focused} />}
    </div>
  );
};
