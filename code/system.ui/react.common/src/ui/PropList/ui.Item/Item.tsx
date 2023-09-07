import { Color, css, DEFAULTS, Wrangle, type t } from './common';
import { PropListLabel } from './Label';
import { PropListValue } from './Value';

export type PropListItemProps = {
  data: t.PropListItem;
  isFirst?: boolean;
  isLast?: boolean;
  defaults: t.PropListDefaults;
  theme?: t.PropListTheme;
  style?: t.CssValue;
};

export const PropListItem: React.FC<PropListItemProps> = (props) => {
  const { data, isFirst, isLast, defaults } = props;
  const theme = Wrangle.theme(props.theme);
  const hasValue = Boolean(data.label);
  const selected = Wrangle.selected(data, theme.is.dark);
  const divider = data.divider ?? true;

  /**
   * Render
   */
  const noBorder = isLast || !divider;
  const borderColor = theme.color.alpha(noBorder ? 0 : 0.1);
  const styles = {
    base: css({
      backgroundColor: selected ? Color.format(selected.color) : undefined,
      Flex: 'horizontal-start-spaceBetween',
      position: 'relative',
      paddingTop: 4,
      paddingBottom: noBorder ? 0 : 4,
      minHeight: 16,
      fontSize: DEFAULTS.fontSize,
      borderBottom: `solid ${noBorder ? 0 : 1}px ${borderColor}`,
      ':first-child': { paddingTop: 2 },
      ':last-child': { border: 'none', paddingBottom: 2 },
    }),
  };

  return (
    <div {...styles.base} title={data.tooltip}>
      {hasValue && <PropListLabel data={data} defaults={defaults} theme={props.theme} />}
      <PropListValue
        item={data}
        isFirst={isFirst}
        isLast={isLast}
        defaults={defaults}
        theme={props.theme}
      />
    </div>
  );
};
