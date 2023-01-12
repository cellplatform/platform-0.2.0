import { forwardRef } from 'react';

import { Color, COLORS, css, Style, t } from '../common';
export * from './types.mjs';

/**
 * Component
 */
export const Card = forwardRef<HTMLDivElement, t.CardProps>((props, ref) => {
  const { showAsCard = true } = props;
  const borderColor = props.border?.color ?? Color.alpha(COLORS.DARK, 0.3);

  const bg = props.background ?? {};
  const bgColor = bg.color ?? 1;

  const shadow = toShadow(props.shadow);
  const width = typeof props.width === 'number' ? { fixed: props.width } : props.width;
  const height = typeof props.height === 'number' ? { fixed: props.height } : props.height;

  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      userSelect: toUserSelect(props.userSelect),

      width: width?.fixed,
      height: height?.fixed,
      minWidth: width?.min ?? 10,
      minHeight: height?.min ?? 10,
      maxWidth: width?.max,
      maxHeight: height?.max,

      ...Style.toMargins(props.margin),
    }),
    card: css({
      border: `solid 1px ${Color.format(borderColor)}`,
      borderRadius: props.border?.radius ?? 4,
      backgroundColor: Color.format(bgColor),
      backdropFilter: typeof bg.blur === 'number' ? `blur(${bg.blur}px)` : undefined,
      boxShadow: Style.toShadow(shadow),
      ...Style.toPadding(props.padding),
    }),
  };

  return (
    <div
      ref={ref}
      {...css(styles.base, showAsCard ? styles.card : undefined, props.style)}
      onDoubleClick={props.onDoubleClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
    </div>
  );
});

Card.displayName = 'Card';

/**
 * [Helpers]
 */

function toUserSelect(value: t.CardProps['userSelect']) {
  value = value ?? false;
  value = value === true ? 'auto' : value;
  value = value === false ? 'none' : value;
  return value as React.CSSProperties['userSelect'];
}

function toShadow(value: t.CardProps['shadow']): t.CssShadow | undefined {
  if (value === false) return undefined;
  if (value === true || value === undefined) return { y: 2, color: -0.08, blur: 6 };
  return value;
}
