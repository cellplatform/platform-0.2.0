import { COLORS, DEFAULTS, Flip, Spinner, css, type t } from './common';
import { Wrangle } from './u.Wrangle';

export const View: React.FC<t.ModuleLoaderProps> = (props) => {
  const { flipped = DEFAULTS.flipped } = props;
  const spinning = Wrangle.spinning(props);
  const is = Wrangle.is(props);

  /**
   * TODO 🐷
   */

  /**
   * Render
   */
  const speed = spinning?.transition ?? DEFAULTS.spinning.transition;

  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      color: is.dark ? COLORS.WHITE : COLORS.BLACK,
    }),
    front: {
      base: css({ position: 'relative', display: 'grid' }),
      content: css({
        opacity: spinning ? spinning.bodyOpacity ?? 0 : 1,
        filter: `blur(${spinning?.bodyBlur ?? 0}px)`,
        transition: `opacity ${speed}ms ease-out`,
      }),
    },
    spinner: css({ Absolute: 0, display: 'grid', placeItems: 'center' }),
  };

  const elSpinner = spinning && (
    <div {...styles.spinner}>
      <Spinner.Bar width={spinning.width} color={spinning.color} />
    </div>
  );

  const elFront = (
    <div {...styles.front.base}>
      <div {...styles.front.content}>{`🐷 ${DEFAULTS.displayName}`}</div>
      {elSpinner}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Flip flipped={flipped} front={elFront} back={props.back?.element} />
    </div>
  );
};
