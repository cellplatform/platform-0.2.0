import { css, t, Util } from './common';

export type PropListLabelProps = {
  data: t.PropListItem;
  defaults: t.PropListDefaults;
  theme?: t.PropListTheme;
  style?: t.CssValue;
};

export const PropListLabel: React.FC<PropListLabelProps> = (props) => {
  const theme = Util.theme(props.theme);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      userSelect: 'none',
      position: 'relative',
      marginRight: 15,
      marginLeft: props.data.indent,
      color: theme.color.alpha(0.4),
    }),
  };
  return <div {...css(styles.base, props.style)}>{props.data.label}</div>;
};
