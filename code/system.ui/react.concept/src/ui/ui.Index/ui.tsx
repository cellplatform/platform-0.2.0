import { Wrangle } from './Wrangle';
import { DEFAULTS, Item, css, type t, Is } from './common';
import { Section } from './ui.Section';

export const View: React.FC<t.IndexProps> = (props) => {
  const { items = [] } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    section: css({}),
    item: css({ marginBottom: 3 }),
  };

  const elList = items.map((item, index) => {
    const text = DEFAULTS.untitled;
    const isSelected = index === props.selected;
    const isFocused = isSelected && props.focused;

    if (Is.namespace(item)) {
      return <Section key={index} ns={item} style={styles.section} />;
    }

    if (Is.slug(item)) {
      return (
        <Item.Label.View
          style={styles.item}
          key={index}
          label={text}
          selected={isSelected}
          focused={isFocused}
          borderRadius={3}
          onClick={(e) => props.onSelect?.({ index })}
        />
      );
    }

    return null;
  });

  return <div {...css(styles.base, props.style)}>{elList}</div>;
};
