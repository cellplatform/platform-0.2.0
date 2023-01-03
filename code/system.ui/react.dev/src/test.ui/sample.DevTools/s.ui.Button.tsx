import { Color, COLORS, css, t, useMouseState } from '../common';
import { RenderCount } from '../../ui/RenderCount';

export type ButtonSampleClickHandler = (e: ButtonSampleClickHandlerArgs) => void;
export type ButtonSampleClickHandlerArgs = { ctx: t.DevCtx; label: string };

export type ButtonProps = {
  ctx: t.DevCtx;
  label?: string;
  style?: t.CssValue;
  onClick?: ButtonSampleClickHandler;
};

export const ButtonSample: React.FC<ButtonProps> = (props) => {
  const { ctx, label = 'Unnamed' } = props;
  const mouse = useMouseState();

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      color: COLORS.DARK,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      userSelect: 'none',
      transform: `translateY(${mouse.isDown ? 1 : 0}px)`,
      cursor: 'pointer',
      display: 'inline-grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: 4,
    }),
    icon: {
      base: css({
        backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'start',
      }),
      image: css({
        Size: 22,
        backgroundColor: Color.alpha(COLORS.MAGENTA, 0.2),
        border: `dashed 1px ${Color.format(-0.3)}`,
        borderRadius: 3,
        margin: 2,
      }),
    },
    body: css({
      position: 'relative',
      margin: 1,
      color: mouse.isOver ? COLORS.BLUE : COLORS.DARK,
      display: 'grid',
      alignContent: 'center',
      justifyContent: 'start',
    }),
  };

  return (
    <div
      {...css(styles.base, props.style)}
      {...mouse.on}
      onClick={() => props.onClick?.({ ctx, label })}
    >
      <div {...styles.icon.base}>
        <div {...styles.icon.image} />
      </div>
      <div {...styles.body}>{label}</div>
      <RenderCount />
    </div>
  );
};
