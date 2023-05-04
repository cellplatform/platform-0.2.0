import { forwardRef } from 'react';

import { Color, COLORS, css, Style, t } from '../common';
import { Flip } from '../Flip';

/**
 * Component
 */
export const Card = forwardRef<HTMLDivElement, t.CardProps>((props, ref) => {
  const { showAsCard = true, backside } = props;

  const bg = Wrangle.bg(props);
  const border = Wrangle.border(props);
  const shadow = Wrangle.shadow(props);
  const size = Wrangle.size(props);
  const showBackside = Wrangle.showBackside(props);

  /**
   * Handlers
   */
  const focusHandler = (focused: boolean) => () => props.onFocusChange?.({ focused });

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      userSelect: Wrangle.userSelect(props),

      width: size.width?.fixed,
      height: size.height?.fixed,
      minWidth: size.width?.min ?? 10,
      minHeight: size.height?.min ?? 10,
      maxWidth: size.width?.max,
      maxHeight: size.height?.max,

      ...Style.toMargins(props.margin),
      display: 'grid',
    }),
    card: css({
      border: `solid 1px ${Color.format(border.color)}`,
      borderRadius: border.radius,
      backgroundColor: Color.format(bg.color),
      backdropFilter: typeof bg.blur === 'number' ? `blur(${bg.blur}px)` : undefined,
      boxShadow: Style.toShadow(shadow),
      transition: `box-shadow 0.1s ease`,
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
      tabIndex={Wrangle.tabIndex(props)}
      {...css(styles.base, props.style)}
      onDoubleClick={props.onDoubleClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onFocus={focusHandler(true)}
      onBlur={focusHandler(false)}
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
  userSelect(props: t.CardProps) {
    let value = props.userSelect;
    value = value ?? false;
    value = value === true ? 'auto' : value;
    value = value === false ? 'none' : value;
    return value as React.CSSProperties['userSelect'];
  },

  size(props: t.CardProps) {
    const width = typeof props.width === 'number' ? { fixed: props.width } : props.width;
    const height = typeof props.height === 'number' ? { fixed: props.height } : props.height;
    return { width, height };
  },

  bg(props: t.CardProps) {
    const { background = {} } = props;
    const { color = 1, blur } = background;
    return { color, blur };
  },

  border(props: t.CardProps) {
    const { border, focused } = props;
    const color = border?.color ?? Color.alpha(COLORS.DARK, focused ? 0.35 : 0.3);
    const radius = props.border?.radius ?? 4;
    return { color, radius };
  },

  shadow(props: t.CardProps): t.CssShadow | undefined {
    const { shadow, focused } = props;
    if (shadow === false) return undefined;
    if (shadow === true || shadow === undefined) {
      return {
        y: 2,
        color: Color.alpha(COLORS.DARK, focused ? 0.15 : 0.1),
        blur: focused ? 15 : 6,
      };
    }
    return shadow;
  },

  showBackside(props: t.CardProps): t.CardBackside {
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

  canFocus(props: t.CardProps) {
    return props.onFocusChange || typeof props.focused === 'boolean';
  },

  tabIndex(props: t.CardProps) {
    if (typeof props.tabIndex === 'number') return props.tabIndex;
    return Wrangle.canFocus(props) ? 0 : undefined;
  },
};
