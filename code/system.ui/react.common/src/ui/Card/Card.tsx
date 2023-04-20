import { forwardRef } from 'react';

import { Color, COLORS, css, Style, t } from '../common';
import { Flip } from '../Flip';

/**
 * Component
 */
export const Card = forwardRef<HTMLDivElement, t.CardProps>((props, ref) => {
  const { showAsCard = true, backside } = props;

  const bg = props.background ?? {};
  const bgColor = bg.color ?? 1;
  const borderColor = props.border?.color ?? Color.alpha(COLORS.DARK, 0.3);
  const shadow = Wrangle.shadow(props.shadow);
  const width = typeof props.width === 'number' ? { fixed: props.width } : props.width;
  const height = typeof props.height === 'number' ? { fixed: props.height } : props.height;
  const showBackside = Wrangle.showBackside(props);

  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      userSelect: Wrangle.userSelect(props.userSelect),

      width: width?.fixed,
      height: height?.fixed,
      minWidth: width?.min ?? 10,
      minHeight: height?.min ?? 10,
      maxWidth: width?.max,
      maxHeight: height?.max,

      ...Style.toMargins(props.margin),
      display: 'grid',
    }),
    card: css({
      border: `solid 1px ${Color.format(borderColor)}`,
      borderRadius: props.border?.radius ?? 4,
      backgroundColor: Color.format(bgColor),
      backdropFilter: typeof bg.blur === 'number' ? `blur(${bg.blur}px)` : undefined,
      boxShadow: Style.toShadow(shadow),
      ...Style.toPadding(props.padding),
      display: 'grid',
    }),
  };

  const sideStyle = showAsCard ? styles.card : undefined;
  const elFront = <div {...sideStyle}>{props.children}</div>;
  const elBack = backside && <div {...sideStyle}>{backside}</div>;

  return (
    <div
      ref={ref}
      {...css(styles.base, props.style)}
      onDoubleClick={props.onDoubleClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <Flip
        flipped={showBackside.flipped}
        speed={showBackside.speed}
        front={elFront}
        back={elBack}
      />
    </div>
  );
});

Card.displayName = 'Card';

/**
 * [Helpers]
 */

const Wrangle = {
  userSelect(value: t.CardProps['userSelect']) {
    value = value ?? false;
    value = value === true ? 'auto' : value;
    value = value === false ? 'none' : value;
    return value as React.CSSProperties['userSelect'];
  },

  shadow(value: t.CardProps['shadow']): t.CssShadow | undefined {
    if (value === false) return undefined;
    if (value === true || value === undefined) return { y: 2, color: -0.08, blur: 6 };
    return value;
  },

  showBackside(props: t.CardProps): t.CardShowBackside {
    let flipped = false;
    let speed = Flip.DEFAULTS.speed;
    if (!props.showBackside) return { flipped, speed };
    if (props.backside) {
      if (props.showBackside === true) flipped = true;
      if (typeof props.showBackside === 'object') {
        flipped = props.showBackside.flipped ?? false;
        speed = props.showBackside.speed ?? speed;
      }
    }
    return { flipped, speed };
  },
};
