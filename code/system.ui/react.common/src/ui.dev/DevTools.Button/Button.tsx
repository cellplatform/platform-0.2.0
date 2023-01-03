import { useState } from 'react';
import { COLORS, css, t } from '../common';
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

  const [isDown, setDown] = useState(false);
  const down = (isDown: boolean) => () => setDown(isDown);

  const [isOver, setOver] = useState(false);
  const over = (isOver: boolean) => () => {
    setOver(isOver);
    if (isOver === false) setDown(false);
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

      transform: `translateY(${isDown ? 1 : 0}px)`,
      display: 'inline-grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: 4,
    }),
    icon: css({
      marginRight: 4,
    }),
    body: css({
      position: 'relative',
      color: isOver ? COLORS.BLUE : COLORS.DARK,
      display: 'grid',
      alignContent: 'center',
      justifyContent: 'start',
      gridTemplateColumns: '1fr auto',
    }),
  };

  return (
    <div
      {...css(styles.base, props.style)}
      onClick={() => props.onClick?.({ ctx })}
      onMouseDown={down(true)}
      onMouseUp={down(false)}
      onMouseEnter={over(true)}
      onMouseLeave={over(false)}
    >
      <ButtonIcon isDown={isDown} isOver={isOver} style={styles.icon} />
      <div {...styles.body}>
        {label}
        {props.right}
      </div>
    </div>
  );
};
