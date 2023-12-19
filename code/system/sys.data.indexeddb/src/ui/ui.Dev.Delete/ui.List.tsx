import { css, type t } from './common';
import { ListItem } from './ui.List.Item';

export type ListProps = {
  items: t.DevDbItem[];
  deleted: t.DevDbItem['name'][];
  style?: t.CssValue;
  onDeleteClick?: t.DevDbDeleteClickHandler;
};

export const List: React.FC<ListProps> = (props) => {
  const { items = [], deleted = [] } = props;

  /**
   * Render
   */
  const styles = {
    base: css({
      boxSizing: 'border-box',
      padding: 8,
      paddingRight: 12,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {items.map((item, i) => (
        <ListItem
          key={i}
          deleted={wrangle.isDeleted(item, deleted)}
          index={i}
          item={item}
          onDeleteClick={props.onDeleteClick}
        />
      ))}
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  isDeleted(item: t.DevDbItem, deleted: t.DevDbItem['name'][]) {
    return deleted.some((name) => item.name === name);
  },
} as const;
