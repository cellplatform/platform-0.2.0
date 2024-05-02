import { DEFAULTS, css, type t } from './common';
import { ListItem } from './ui.List.Item';

export type ListProps = {
  items: t.DevDbItem[];
  deleted: t.DevDbItem['name'][];
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onDeleteClick?: t.DevDbDeleteClickHandler;
};

export const List: React.FC<ListProps> = (props) => {
  const { items = [], deleted = [], theme } = props;

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
      {items
        .filter((item) => !item.name.endsWith(DEFAULTS.systemSuffix))
        .map((item, i) => {
          return (
            <ListItem
              key={i}
              index={i}
              item={item}
              deleted={wrangle.isDeleted(item, deleted)}
              onDeleteClick={props.onDeleteClick}
              theme={theme}
            />
          );
        })}
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
