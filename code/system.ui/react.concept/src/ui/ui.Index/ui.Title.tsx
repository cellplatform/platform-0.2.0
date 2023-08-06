import { COLORS, Color, DEFAULTS, css, type t } from './common';

export type SectionProps = {
  text?: string;
  style?: t.CssValue;
};

export const Title: React.FC<SectionProps> = (props) => {
  const text = (props.text || '').trim() || DEFAULTS.untitled;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      userSelect: 'none',
      marginTop: 10,
      ':first-child': { marginTop: 0 },
    }),
    text: css({
      fontSize: 12,
      color: Color.alpha(COLORS.DARK, 0.5),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.text}>{text}</div>
    </div>
  );
};
