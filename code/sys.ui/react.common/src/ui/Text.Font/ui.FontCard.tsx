import { FC, Color, COLORS, css, t, rx } from './common';

export type FontCardFontProp = { size?: number; family?: string };
export type FontCardProps = {
  char?: string;
  font?: FontCardFontProp;
  size?: number;
  color?: string;
  style?: t.CssValue;
};

const DEFAULT = {
  char: 'à',
  fontSize: 120,
  fontFamily: 'sans-serif',
};

/**
 * Component
 */
const View: React.FC<FontCardProps> = (props) => {
  const { font = {}, color = COLORS.DARK, size = 200 } = props;
  const fontSize = font.size ?? DEFAULT.fontSize;
  const fontFamily = font.family ?? DEFAULT.fontFamily;
  const char = props.char ?? DEFAULT.char;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: Color.alpha(COLORS.WHITE, 0.2),
      backdropFilter: `blur(12px)`,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.3)}`,
      borderRadius: 5,
      Flex: 'x-center-stretch',
      height: size,
      minWidth: size,
    }),
    char: css({
      position: 'relative',
      flex: 1,
      textAlign: 'center',
      fontSize,
      fontFamily,
      color,
    }),
    line: css({
      borderBottom: `solid 1px ${Color.alpha(COLORS.MAGENTA, 0.3)}`,
      height: 1,
    }),
    lineBottom: css({ Absolute: [null, 0, '0.22em', 0] }),
    lineTop: css({ Absolute: [null, 0, '0.75em', 0] }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.char}>
        <div>{char}</div>

        <div {...css(styles.line, styles.lineTop)} />
        <div {...css(styles.line, styles.lineBottom)} />
      </div>
    </div>
  );
};

type Fields = {
  DEFAULT: typeof DEFAULT;
};
export const FontCard = FC.decorate<FontCardProps, Fields>(
  View,
  { DEFAULT },
  { displayName: 'Font.Card' },
);
