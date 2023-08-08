import { Wrangle } from './Wrangle';
import { COLORS, Color, css, type t } from './common';

export type SectionProps = {
  item: t.SlugNamespace;
  style?: t.CssValue;
};

export const Title: React.FC<SectionProps> = (props) => {
  const { item } = props;
  const text = Wrangle.title(item);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      userSelect: 'none',
      marginTop: 20,
      marginBottom: 5,
      ':first-child': { marginTop: 0 },
    }),
    text: css({
      fontSize: 12,
      color: Color.alpha(COLORS.DARK, 0.4),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.text}>{text}</div>
    </div>
  );
};
