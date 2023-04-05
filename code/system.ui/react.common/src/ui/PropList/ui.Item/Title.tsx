import { Style, css, DEFAULTS, t, Wrangle } from './common';

export type PropListTitleProps = {
  children?: t.PropListTitleProps['title'];
  margin?: t.PropListTitleProps['titleMargin'];
  defaults: t.PropListDefaults;
  ellipsis?: boolean;
  theme?: t.PropListTheme;
  style?: t.CssValue;
};

export const PropListTitle: React.FC<PropListTitleProps> = (props) => {
  const { ellipsis = true, margin = [0, 0, 5, 0] } = props;

  const theme = Wrangle.theme(props.theme);
  const content = Wrangle.renderTitle(props.children);

  const styles = {
    base: css({
      flex: 1,
      boxSizing: 'border-box',
      position: 'relative',
      ...Style.toPadding(margin),

      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: 8,
    }),
    edge: css({
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

  const edge = css(styles.edge, ellipsis && styles.ellipsis);

  return (
    <div {...css(styles.base, props.style)}>
      <div {...edge}>{content[0]}</div>
      <div />
      <div {...edge}>{content[1]}</div>
    </div>
  );
};
