import { Color, css, type t, format } from './common';
import { useHandler } from './use.Handler';

export type PropListLabelProps = {
  data: t.PropListItem;
  defaults: t.PropListDefaults;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  cursor?: t.CSSProperties['cursor'];
};

export const PropListLabel: React.FC<PropListLabelProps> = (props) => {
  const item = format(props.data);
  const handler = useHandler(props.data, props.defaults, item.label.onClick);

  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      userSelect: 'none',
      position: 'relative',
      marginLeft: props.data.indent,
      color: theme.alpha.fg(0.4),
      cursor: props.cursor ?? handler.cursor,
      display: 'grid',
      alignContent: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)} onClick={handler.onClick}>
      {handler.message ?? item.label.body}
    </div>
  );
};
