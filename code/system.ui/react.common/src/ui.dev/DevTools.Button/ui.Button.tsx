import { COLORS, css, t, useMouseState } from '../common';
import { ButtonIcon } from './ui.Button.Icon';

export type ButtonProps = {
  label?: string | JSX.Element;
  right?: JSX.Element;

  style?: t.CssValue;
  labelOpacity?: number;
  onClick?: React.MouseEventHandler;
};

export const Button: React.FC<ButtonProps> = (props) => {
  const { label = 'Unnamed' } = props;

  const mouse = useMouseState();
  const isActive = Boolean(props.onClick);

  /**
   * [Handlers]
   */
  const handlerClick: React.MouseEventHandler = (e) => {
    if (isActive) props.onClick?.(e);
  };

  /**
   * [Render]
   */

  const pressedTransform = `translateY(${isActive && mouse.isDown ? 1 : 0}px)`;

  const styles = {
    base: css({
      position: 'relative',
      userSelect: 'none',
      cursor: isActive ? 'pointer' : 'default',
      color: COLORS.DARK,
      fontSize: 14,

      display: 'inline-grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: 4,
    }),
    icon: css({
      position: 'relative',
      top: -1,
      marginRight: 4,
      transform: pressedTransform,
    }),
    body: css({
      position: 'relative',
      color: isActive && mouse.isOver ? COLORS.BLUE : COLORS.DARK,
      display: 'grid',
      alignContent: 'center',
      justifyContent: 'start',
      gridTemplateColumns: '1fr auto',
    }),
    left: css({ transform: pressedTransform }),
    right: css({}),
    label: css({
      opacity: Wrangle.labelOpacity(props),
    }),
  };

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers} onClick={handlerClick}>
      <ButtonIcon
        isActive={isActive}
        isDown={mouse.isDown}
        isOver={mouse.isOver}
        style={styles.icon}
      />
      <div {...styles.body}>
        <div {...css(styles.left, styles.label)}>{label}</div>
        <div {...styles.right}>{props.right}</div>
      </div>
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  labelOpacity(props: ButtonProps) {
    const { labelOpacity } = props;
    if (!props.onClick) return 0.3;
    return labelOpacity === undefined ? 1 : labelOpacity;
  },
};
