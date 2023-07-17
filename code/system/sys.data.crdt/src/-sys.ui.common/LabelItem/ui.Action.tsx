import { Button, css, DEFAULTS, type t } from './common';
import { ActionSpinner } from './ui.Action.Spinner';
import { Wrangle } from './Wrangle';

export type ActionProps = {
  action: t.LabelAction;
  enabled?: boolean;
  selected?: boolean;
  focused?: boolean;
  opacity?: number;
  style?: t.CssValue;
};

export const Action: React.FC<ActionProps> = (props) => {
  const { action, focused } = props;
  const { onClick, width } = action;
  const isButton = onClick && (action.enabled ?? true);
  const isEnabled = action.enabled ?? props.enabled ?? DEFAULTS.enabled;
  const isSpinning = action.spinning ?? false;
  const opacity = props.opacity ?? (isEnabled ? 1 : 0.3);

  /**
   * [Handlers]
   */
  const handleClick = () => {
    onClick?.({ kind: action.kind });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      opacity,
      width,
      pointerEvents: isSpinning ? 'none' : 'auto',
    }),
    body: css({
      width,
      display: 'grid',
      placeItems: 'center',
      opacity: isSpinning ? 0 : 1,
      transition: 'opacity 0.2s',
    }),

    button: css({ display: 'grid', placeItems: 'center' }),
  };

  const elIcon = Wrangle.icon(props);
  const elButton = isButton && (
    <Button
      onMouseDown={(e) => e.stopPropagation()}
      onClick={handleClick}
      isEnabled={isEnabled}
      disabledOpacity={1}
    >
      <div {...styles.button}>{elIcon}</div>
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>{elButton || elIcon}</div>
      {isSpinning && <ActionSpinner action={action} />}
    </div>
  );
};
