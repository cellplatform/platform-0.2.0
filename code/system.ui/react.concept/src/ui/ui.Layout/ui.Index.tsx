import { Item, css, type t } from './common';

export type IndexProps = {
  slugs?: t.ConceptSlug__[];
  selected?: number;
  focused?: boolean;
  playing?: boolean;
  style?: t.CssValue;
  onSelect?: t.LayoutSelectHandler;
};

export const Index: React.FC<IndexProps> = (props) => {
  const { slugs = [] } = props;
  const length = slugs.length;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      boxSizing: 'border-box',
      width: 190,
      padding: 5,
      paddingLeft: 15,
      display: 'grid',
      alignContent: 'center',
      paddingBottom: 100,
    }),
    item: css({ marginBottom: 3 }),
  };

  const elList = Array.from({ length }).map((_, index) => {
    const slug = slugs[index];
    const isSelected = index === props.selected;
    const isFocused = isSelected && props.focused;
    return (
      <Item.Label.View
        style={styles.item}
        key={index}
        label={slug.title}
        selected={isSelected}
        focused={isFocused}
        borderRadius={3}
        onClick={(e) => props.onSelect?.({ index })}
      />
    );
  });

  return <div {...css(styles.base, props.style)}>{elList}</div>;
};
