import { COLORS, css, t, useMouseState } from '../common';
import { ButtonIcon } from './ui.Button.Icon';

export type ButtonProps = {
  label?: string | JSX.Element;
  right?: JSX.Element;

  style?: t.CssValue;
  labelOpacity?: number;
  onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = (props) => {
  const mouse = useMouseState();
  const isActive = Boolean(props.onClick);

  /**
   * [Handlers]
   */
  const handlerClick = () => {
    if (isActive) props.onClick?.();
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      userSelect: 'none',
      cursor: isActive ? 'pointer' : 'default',
      color: COLORS.DARK,
      fontSize: 14,

      transform: `translateY(${isActive && mouse.isDown ? 1 : 0}px)`,
      display: 'inline-grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: 4,
    }),
    icon: css({
      position: 'relative',
      top: -1,
      marginRight: 4,
    }),
    body: css({
      position: 'relative',
      color: isActive && mouse.isOver ? COLORS.BLUE : COLORS.DARK,
      display: 'grid',
      alignContent: 'center',
      justifyContent: 'start',
      gridTemplateColumns: '1fr auto',
    }),
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
        <div {...styles.label}>{props.label || 'Unnamed'}</div>
        {props.right}
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
