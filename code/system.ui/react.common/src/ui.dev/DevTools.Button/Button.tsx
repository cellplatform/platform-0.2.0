import { COLORS, css, t, useMouseState } from '../common';
import { ButtonIcon } from './Button.Icon';

export type ButtonSampleClickHandler = (e: ButtonSampleClickHandlerArgs) => void;
export type ButtonSampleClickHandlerArgs = { ctx: t.DevCtx };

export type ButtonProps = {
  ctx: t.DevCtx;
  label?: string | JSX.Element;
  right?: JSX.Element;
  style?: t.CssValue;
  onClick?: ButtonSampleClickHandler;
};

export const Button: React.FC<ButtonProps> = (props) => {
  const { ctx, label = 'Unnamed' } = props;
  const mouse = useMouseState();

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
    <div
      {...css(styles.base, props.style)}
      {...mouse.handlers}
      onClick={() => props.onClick?.({ ctx })}
    >
      <ButtonIcon isDown={mouse.isDown} isOver={mouse.isOver} style={styles.icon} />
      <div {...styles.body}>
        {label}
        {props.right}
      </div>
    </div>
  );
};
