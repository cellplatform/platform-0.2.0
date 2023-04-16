import { COLORS, css, DEFAULTS, Style, t } from './common';

import { PropListItem } from './ui.Item/Item';
import { PropListTitle } from './ui.Item/Title';
import { Wrangle } from './Util.mjs';
import { Card } from '../Card';

/**
 * Component
 */
export const PropList: React.FC<t.PropListProps> = (props) => {
  const { theme = DEFAULTS.theme } = props;
  const items = Wrangle.items(props.items);
  const width = Wrangle.sizeProp(props.width);
  const height = Wrangle.sizeProp(props.height);
  const card = Wrangle.cardProps(props.card);

  const defaults: t.PropListDefaults = {
    clipboard: true,
    ...props.defaults,
  };

  const styles = {
    base: css({
      position: 'relative',
      color: COLORS.DARK,

      width: width?.fixed,
      height: height?.fixed,
      minWidth: width?.min ?? 10,
      minHeight: height?.min ?? 10,
      maxWidth: width?.max,
      maxHeight: height?.max,

      boxSizing: 'border-box',
      ...Style.toMargins(card ? undefined : props.margin),
      ...Style.toPadding(card ? undefined : props.padding),
    }),
    items: css({}),
    title: css({}),
  };

  const elItems = items
    .filter((item) => Boolean(item))
    .filter((item) => item?.visible ?? true)
    .map((item, i) => {
      return (
        <PropListItem
          key={i}
          data={item as t.PropListItem}
          isFirst={i == 0}
          isLast={i === items.length - 1}
          defaults={defaults}
          theme={theme}
        />
      );
    });

  const elTitle = props.title && (
    <PropListTitle style={styles.title} theme={theme} defaults={defaults} data={props.title} />
  );

  return (
    <Card
      showAsCard={Boolean(card)}
      style={css(styles.base, props.style)}
      padding={props.padding ?? [20, 25, 30, 25]}
      margin={props.margin}
    >
      {elTitle}
      <div {...styles.items}>{elItems}</div>
    </Card>
  );
};
