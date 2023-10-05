import { Color, DEFAULTS, R, type t } from './common';

export const CssUtil = {
  /**
   * Convert TextInput props to placeholder style.
   */
  toPlaceholder(props: t.TextInputProps): t.CssValue {
    const { isEnabled = true, valueStyle = DEFAULTS.prop.valueStyle, placeholderStyle } = props;
    const styles = { ...R.clone(valueStyle), ...placeholderStyle };
    return CssUtil.toTextInput(isEnabled, styles);
  },

  /**
   * Converts a set of TextInput styles into CSS.
   */
  toTextInput(isEnabled: boolean, styles: t.TextInputStyle): t.CssValue {
    return {
      ...CssUtil.toText(styles),
      color: isEnabled ? Color.format(styles.color) : Color.format(styles.disabledColor),
    };
  },

  /**
   * Converts <Text> style props to a CSS object.
   */
  toText(props: t.TextStyle): t.CssValue {
    const {
      fontSize,
      color,
      fontFamily,
      align,
      italic,
      opacity,
      letterSpacing,
      lineHeight,
      textShadow,
      uppercase,
    } = CssUtil.pluckText(props);

    return {
      color: Color.format(color),
      fontFamily,
      fontSize,
      fontWeight: CssUtil.fontWeight(props.fontWeight),
      fontStyle: italic ? 'italic' : undefined,
      textAlign: align,
      opacity,
      letterSpacing,
      lineHeight,
      textShadow: CssUtil.toTextShadow(textShadow),
      textTransform: uppercase ? ('uppercase' as React.CSSProperties['textTransform']) : undefined,
    };
  },

  fontWeight(value?: t.TextStyle['fontWeight']): number {
    const weights = DEFAULTS.systemFont.weights;
    if (value === 'light') return weights.light;
    if (value === 'normal') return weights.normal;
    if (value === 'bold') return weights.bold;
    return weights.normal;
  },

  pluckText(props: t.TextStyle): any {
    const {
      color = -0.7,
      align = 'left',
      italic = false,
      opacity = 1,
      textShadow,
      uppercase = false,
    } = props;

    return {
      ...CssUtil.pluckFont(props),
      color,
      align,
      italic,
      opacity,
      textShadow,
      uppercase,
    };
  },

  pluckFont(props: t.TextStyle): t.CssValue {
    const {
      fontSize = DEFAULTS.prop.valueStyle.fontSize,
      fontFamily = DEFAULTS.systemFont.sans.family,
      fontWeight = 'normal',
      letterSpacing,
      lineHeight,
    } = props;

    return {
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing,
    } as any;
  },

  /**
   * Produces a `textShadow` CSS value from an array.
   * [0:offset-y, 1:color.format()]
   */
  toTextShadow(value?: string | Array<number | string>) {
    if (value === undefined) return;
    if (typeof value === 'string') return value as string;
    return `0px ${value[0]}px ${Color.format(value[1])}`;
  },
};
