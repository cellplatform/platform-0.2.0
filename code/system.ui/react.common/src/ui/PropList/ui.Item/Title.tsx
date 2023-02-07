import { css, DEFAULTS, t, toTheme } from './common';

export type PropListTitleProps = {
  children?: React.ReactNode;
  defaults: t.PropListDefaults;
  ellipsis?: boolean;
  theme?: t.PropListTheme;
  style?: t.CssValue;
};

export const PropListTitle: React.FC<PropListTitleProps> = (props) => {
  const ellipsis = props.ellipsis ?? true;
  const theme = toTheme(props.theme);

  const styles = {
    base: css({
      position: 'relative',
      width: '100%',
      flex: 1,
      fontWeight: 'bold',
      fontSize: DEFAULTS.fontSize + 1,
      color: theme.color.base,
    }),
    ellipsis: css({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
  };

  return (
    <div {...css(styles.base, ellipsis && styles.ellipsis, props.style)}>{props.children}</div>
  );
};
