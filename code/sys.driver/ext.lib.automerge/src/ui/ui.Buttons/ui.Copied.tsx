import { Color, COLORS, css, FONTS, type t } from './common';

export const Copied: React.FC<t.CopiedProps> = (props) => {
  const { text = 'copied' } = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      ...FONTS.mono,
      fontSize: props.fontSize ?? FONTS.mono.fontSize,
      color: COLORS.GREEN,
    }),
  };

  return <div {...css(styles.base, props.style)}>{text}</div>;
};
