import { Color, DEFAULTS, Wrangle, css, type t } from './common';
import { PropListLabel } from './ui.Label';
import { PropListValue } from './ui.Value';
import { useHandler } from './use.Handler';

export type PropListItemProps = {
  item: t.PropListItem;
  is: { first: boolean; last: boolean };
  defaults: t.PropListDefaults;
  theme?: t.PropListTheme;
  style?: t.CssValue;
};

export const PropListItem: React.FC<PropListItemProps> = (props) => {
  const { item, is, defaults } = props;
  const theme = Wrangle.theme(props.theme);
  const hasLabel = !!item.label;
  const selected = Wrangle.selected(item, theme.is.dark);
  const divider = item.divider ?? true;

  const handler = useHandler(props.item, props.defaults, item.onClick);

  /**
   * Render
   */
  const noBorder = is.last || !divider;
  const borderColor = theme.color.alpha(noBorder ? 0 : 0.1);
  const styles = {
    base: css({
      backgroundColor: selected ? Color.format(selected.color) : undefined,
      position: 'relative',
      paddingTop: 4,
      paddingBottom: noBorder ? 0 : 4,
      minHeight: 16,
      cursor: handler.cursor,
      fontSize: DEFAULTS.fontSize.sans,
      borderBottom: `solid ${noBorder ? 0 : 1}px ${borderColor}`,
      ':first-child': { paddingTop: 2 },
      ':last-child': { border: 'none', paddingBottom: 2 },

      display: 'grid',
      gridTemplateColumns: hasLabel ? 'auto 1fr' : '1fr',
      justifyContent: 'center',
      columnGap: '10px',
    }),
  };

  return (
    <div {...styles.base} title={item.tooltip} onMouseDown={handler.onClick}>
      {hasLabel && <PropListLabel data={item} defaults={defaults} theme={props.theme} />}
      <PropListValue
        item={item}
        hasLabel={hasLabel}
        defaults={defaults}
        theme={props.theme}
        cursor={handler.cursor}
        message={handler.message}
      />
    </div>
  );
};
