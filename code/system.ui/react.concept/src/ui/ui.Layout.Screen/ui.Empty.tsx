import { COLORS, Color, DEFAULTS, css, type t } from './common';

export type EmptyProps = {
  text?: string;
  style?: t.CssValue;
};

export const Empty: React.FC<EmptyProps> = (props) => {
  const { text = DEFAULTS.text.nothingToDisplay } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      userSelect: 'none',
      fontSize: 14,
      color: Color.alpha(COLORS.DARK, 0.5),
      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{text}</div>
    </div>
  );
};
