import { Color, Icons, css, format, type t } from './common';
import { useHandler } from './use.Handler';

export type PropListLabelProps = {
  data: t.PropListItem;
  defaults: t.PropListDefaults;
  isMouseOverItem?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  cursor?: t.CSSProperties['cursor'];
};

export const PropListLabel: React.FC<PropListLabelProps> = (props) => {
  const theme = Color.theme(props.theme);
  const item = format(props.data);
  const label = item.label;
  const handler = useHandler(props.data, label.onClick, theme.name);
  const hasToggle = !!label.toggle;

  /**
   * Render
   */
  const color = theme.alpha(0.4).fg;
  const styles = {
    base: css({
      userSelect: 'none',
      position: 'relative',
      marginLeft: props.data.indent,
      cursor: props.cursor ?? handler.cursor,
      color,
      display: 'grid',
      alignContent: 'center',
      gridTemplateColumns: `repeat(${hasToggle ? 2 : 1}, auto)`,
    }),
    toggle: css({
      position: 'relative',
      pointerEvents: 'none',
      left: -1,
      transform: `rotate(${label.toggle?.open ? 90 : 0}deg)`,
      transition: 'transform 300ms',
    }),
  };

  const elToggle = hasToggle && <Icons.Triangle.Right size={14} style={styles.toggle} />;

  return (
    <div {...css(styles.base, props.style)} onClick={handler.onClick}>
      {elToggle}
      {handler.message ?? label.body}
    </div>
  );
};
