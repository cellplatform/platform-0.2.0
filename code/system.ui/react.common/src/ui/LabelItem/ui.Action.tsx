import { useRef } from 'react';
import { Button, css, DEFAULTS, type t } from './common';
import { ActionSpinner } from './ui.Action.Spinner';
import { Wrangle } from './Wrangle';

export type ActionProps = {
  index: number;
  total: number;
  item: t.LabelItem;
  renderers: t.LabelItemRenderers;
  action: t.LabelItemAction;
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

export const Action: React.FC<ActionProps> = (props) => {
  const { action, debug, renderers } = props;
  const { index, total, selected, focused, editing, item } = Wrangle.valuesOrDefault(props);
  const { kind, width } = action;
  const enabled = action.enabled ?? props.enabled ?? DEFAULTS.enabled;
  const spinning = action.spinning ?? false;

  const ctxRef = useRef<t.LabelItemActionCtx>({});

  const is = {
    button: Boolean(enabled && (action.button ?? true)),
  } as const;

  /**
   * [Handlers]
   */
  const handleClick = () => {
    const position = { index, total };
    props.onActionClick?.({
      kind,
      position,
      focused: Boolean(focused),
      selected: Boolean(selected),
      editing: Boolean(editing),
      ctx: ctxRef.current,
    });
    props.onItemClick?.({
      position,
      focused: Boolean(focused),
      selected: Boolean(selected),
      editing: Boolean(editing),
      target: 'Item:Action',
      kind: 'Single',
    });
  };

  /**
   * [Render]
   */
  const color = Wrangle.foreColor({ selected, focused });
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

  const args: t.LabelItemRenderActionArgs = {
    kind,
    index,
    total,
    selected,
    enabled,
    focused,
    editing,
    color,
    item,
    set: { ctx: (value) => (ctxRef.current = value) },
  };

  const elBody = Wrangle.render.action(renderers, args);
  if (!elBody) return null;

  const elButton = is.button && (
    <Button
      enabled={enabled}
      disabledOpacity={1}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={handleClick}
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
