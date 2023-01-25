import { Color, DEFAULT, Measure, R, SYSTEM_FONT, t } from './common';
import { TextInputStyle } from './types.mjs';

/**
 * Helpers
 */
export const Util = {
  /**
   * Textbox value helpers.
   */
  value: {
    format(value?: string, maxLength?: number) {
      value = value || '';
      if (typeof maxLength === 'number' && value.length > maxLength) {
        value = value.substring(0, maxLength);
      }
      return value;
    },

    getChangedChar(from: string, to: string) {
      if (to.length === from.length) return '';
      if (to.length < from.length) return '';

      let index = 0;
      for (const toChar of to) {
        const fromChar = from[index];
        if (toChar !== fromChar) return toChar; // Exit - changed character found.
        index += 1;
      }

      return ''; // No change.
    },
  },

  /**
   * Size measurement helpers.
   */
  measure: {
    input(props: t.TextInputProps) {
      const { value: content, valueStyle = DEFAULT.TEXT.STYLE } = props;
      const style = Util.css.toText(valueStyle);
      return Measure.size({ content, ...style });
    },
    text(props: t.TextProps) {
      const { children: content } = props;
      const style = { ...Util.css.toText(props), ...props.style };
      return Measure.size({ content, ...style });
    },
  },

  /**
   * CSS helpers
   */
  css: {
    async toWidth(props: t.TextInputProps) {
      if (!props.autoSize) return props.width;

      const value = props.value;
      const maxWidth = props.maxWidth ?? -1;

      let width = (await Util.measure.input(props)).width;
      width = value === undefined || value === '' ? await Util.css.toMinWidth(props) : width;
      width =
        typeof maxWidth === 'number' && maxWidth !== -1 && width > maxWidth ? maxWidth : width;

      const charWidth = (await Util.measure.input({ ...props, value: 'W' })).width;
      return width + charWidth; // NB: Adding an additional char-width prevents overflow jumping on char-enter.
    },

    async toMinWidth(props: t.TextInputProps): Promise<number> {
      const { minWidth, placeholder, value } = props;

      if (minWidth !== undefined) return minWidth as number;

      // NB: If min-width not specified, use placeholder width.
      if (!value && placeholder) {
        const style = Util.css.toPlaceholder(props);
        const children = props.placeholder;
        const size = await Util.measure.text({ children, style });
        return size.width + 10;
      }

      return -1;
    },

    /**
     * Convert TextInput props to placeholder style.
     */
    toPlaceholder(props: t.TextInputProps) {
      const { isEnabled = true, valueStyle = DEFAULT.TEXT.STYLE, placeholderStyle } = props;
      const styles = { ...R.clone(valueStyle), ...placeholderStyle };
      return Util.css.toTextInput(isEnabled, styles);
    },

    /**
     * Converts a set of TextInput styles into CSS.
     */
    toTextInput(isEnabled: boolean, styles: TextInputStyle): t.CssValue {
      return {
        ...Util.css.toText(styles),
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
        fontWeight,
        fontFamily,
        align,
        italic,
        opacity,
        letterSpacing,
        lineHeight,
        textShadow,
        uppercase,
      } = Util.css.pluckText(props);

      return {
        color: Color.format(color),
        fontFamily,
        fontSize: fontSize,
        fontWeight: SYSTEM_FONT.WEIGHTS[fontWeight],
        fontStyle: italic ? 'italic' : undefined,
        textAlign: align,
        opacity,
        letterSpacing,
        lineHeight,
        textShadow: Util.css.toTextShadow(textShadow),
        textTransform: uppercase
          ? ('uppercase' as React.CSSProperties['textTransform'])
          : undefined,
      };
    },

    pluckText(props: t.TextStyle) {
      const {
        color = -0.7,
        align = 'left',
        italic = false,
        opacity = 1,
        textShadow,
        uppercase = false,
      } = props;

      return {
        ...Util.css.pluckFont(props),
        color,
        align,
        italic,
        opacity,
        textShadow,
        uppercase,
      };
    },

    pluckFont(props: t.TextStyle) {
      const {
        fontSize,
        fontWeight = 'normal',
        fontFamily = SYSTEM_FONT.SANS.FAMILY,
        letterSpacing,
        lineHeight,
      } = props;

      return {
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight,
        letterSpacing,
      };
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
  },
};
