import { Card, COLORS, css, DEFAULTS, type t } from './common';
import { Wrangle } from './u';
import { PropListItem, PropListTitle } from './ui.Item';

/**
 * Component
 */
export const View: React.FC<t.PropListProps> = (props) => {
  const { title, theme = DEFAULTS.theme } = props;
  const items = Wrangle.items(props.items);
  const width = Wrangle.sizeProp(props.width);
  const height = Wrangle.sizeProp(props.height);
  const card = Wrangle.cardProps(props);

  const defaults: t.PropListDefaults = {
    clipboard: false,
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
    }),
    items: css({}),
  };

  const elItems = items
    .filter((item) => !!item)
    .filter((item) => item?.visible ?? true)
    .map((item, i) => {
      return (
        <PropListItem
          key={i}
          data={item!}
          is={{ first: i === 0, last: i === items.length - 1 }}
          defaults={defaults}
          theme={theme}
        />
      );
    });

  const hasTitle = Wrangle.hasTitle(title);
  const elTitle = hasTitle && (
    <PropListTitle total={items.length} theme={theme} defaults={defaults} data={title} />
  );

  // Exit if empty.
  if (items.length === 0 && !hasTitle) return null;

  return (
    <Card
      style={css(styles.base, props.style)}
      showAsCard={Boolean(card)}
      showBackside={{ flipped: props.flipped, speed: card?.flipSpeed }}
      backside={props.backside}
      backsideHeader={props.backsideHeader}
      backsideFooter={props.backsideFooter}
      header={props.header}
      footer={props.footer}
      shadow={card?.shadow}
      background={card?.background}
      border={card?.border}
      padding={props.padding ?? card ? [20, 25] : undefined}
      margin={props.margin}
    >
      <div onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        {elTitle}
        {items.length > 0 && <div {...styles.items}>{elItems}</div>}
      </div>
    </Card>
  );
};
