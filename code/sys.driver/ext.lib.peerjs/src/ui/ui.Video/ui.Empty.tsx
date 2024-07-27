import { Color, DEFAULTS, css, type t } from './common';

export type EmptyProps = {
  value?: string | JSX.Element;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Empty: React.FC<EmptyProps> = (props) => {
  const { value = DEFAULTS.empty } = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      pointerEvents: 'none',
      userSelect: 'none',
      color: theme.fg,
    }),
    text: css({
      opacity: 0.3,
    }),
  };

  const elText = typeof value === 'string' && <div {...styles.text}>{value}</div>;
  return <div {...css(styles.base, props.style)}>{elText || value}</div>;
};
