import { COLORS, css, t, useMouseState } from '../common';
import { ButtonIcon } from './ui.Button.Icon';

export type ButtonClickHandler = (e: ButtonClickHandlerArgs) => void;
export type ButtonClickHandlerArgs = { ctx: t.DevCtx };

export type ButtonProps = {
  ctx: t.DevCtx;
  label?: string | JSX.Element;
  right?: JSX.Element;
  style?: t.CssValue;
  onClick?: ButtonClickHandler;
};

export const Button: React.FC<ButtonProps> = (props) => {
  const { ctx } = props;
  const mouse = useMouseState();

  /**
   * [Handlers]
   */
  const onClick = () => {
    props.onClick?.({ ctx });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      userSelect: 'none',
      cursor: 'pointer',
      color: COLORS.DARK,
      fontSize: 14,

      transform: `translateY(${mouse.isDown ? 1 : 0}px)`,
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
      color: mouse.isOver ? COLORS.BLUE : COLORS.DARK,
      display: 'grid',
      alignContent: 'center',
      justifyContent: 'start',
      gridTemplateColumns: '1fr auto',
    }),
  };

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers} onClick={onClick}>
      <ButtonIcon isDown={mouse.isDown} isOver={mouse.isOver} style={styles.icon} />
      <div {...styles.body}>
        {props.label || 'Unnamed'}
        {props.right}
      </div>
    </div>
  );
};
