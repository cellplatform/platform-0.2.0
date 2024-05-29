import { css, type t } from '../common';

export type HintKeyProps = {
  text: string;
  theme: t.ColorTheme;
  style?: t.CssValue;
};

export const HintKey: React.FC<HintKeyProps> = (props) => {
  const { theme } = props;

  const styles = {
    base: css({
      position: 'relative',
      fontFamily: 'sans-serif',
      fontSize: 11,
      userSelect: 'none',
      color: theme.fg,
      backgroundColor: theme.alpha(0.06).fg,
      border: `solid 1px ${theme.alpha(0.15).fg}`,
      borderRadius: 4,
      fontStyle: 'normal',
      fontWeight: 600,
      display: 'grid',
      placeItems: 'center',
      Padding: [3, 8],
      marginRight: 4,
      ':last-child': { marginRight: 0 },
    }),
  };

  return <div {...css(styles.base, props.style)}>{props.text}</div>;
};
