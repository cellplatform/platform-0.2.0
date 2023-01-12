import { css, DEFAULTS, t, Util } from './common';
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
  const theme = Util.theme(props.theme);
  const hasValue = Boolean(data.label);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Flex: 'horizontal-start-spaceBetween',
      PaddingY: 4,
      fontSize: DEFAULTS.fontSize,
      borderBottom: `solid 1px ${theme.color.alpha(isLast ? 0 : 0.1)}`,
      ':last-child': { border: 'none' },
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
