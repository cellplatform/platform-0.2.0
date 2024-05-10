import { Color, css, type t } from '../common';

export type HintKeyProps = {
  text: string;
  style?: t.CssValue;
};

export const HintKey: React.FC<HintKeyProps> = (props) => {
  const styles = {
    base: css({
      position: 'relative',
      fontFamily: 'sans-serif',
      fontSize: 11,
      userSelect: 'none',
      border: `solid 1px ${Color.format(0.15)}`,
      backgroundColor: Color.format(0.06),
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
