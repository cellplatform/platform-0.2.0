import { Button, css, DEFAULTS, type t } from './common';
import { ActionSpinner } from './ui.Action.Spinner';
import { Wrangle } from './Wrangle';

export type ActionProps = {
  action: t.LabelAction;
  label?: string;
  enabled?: boolean;
  selected?: boolean;
  focused?: boolean;
  editing?: boolean;
  style?: t.CssValue;
};

export const Action: React.FC<ActionProps> = (props) => {
  const { action, selected, focused, editing } = props;
  const { kind, width, onClick } = action;

  const enabled = Wrangle.dynamicValue(action.enabled, props, DEFAULTS.enabled);
  const spinning = Wrangle.dynamicValue(action.spinning, props, false);
  const is = {
    button: Boolean(onClick && enabled),
  };

  /**
   * [Handlers]
   */
  const handleClick = () => onClick?.({ kind });

  /**
   * [Render]
   */
  const styles = {
    base: css({
      width,
      position: 'relative',
      pointerEvents: spinning ? 'none' : 'auto',
    }),
    body: css({
      width,
      display: 'grid',
      placeItems: 'center',
      opacity: spinning ? 0 : 1,
      transition: 'opacity 0.2s',
    }),
    button: css({
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elIcon = Wrangle.icon({ action, selected, enabled, focused, editing });

  const elButton = is.button && (
    <Button
      onMouseDown={(e) => e.stopPropagation()}
      onClick={handleClick}
      isEnabled={enabled}
      disabledOpacity={1}
    >
      <div {...styles.button}>{elIcon}</div>
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>{elButton || elIcon}</div>
      {spinning && <ActionSpinner action={action} />}
    </div>
  );
};
