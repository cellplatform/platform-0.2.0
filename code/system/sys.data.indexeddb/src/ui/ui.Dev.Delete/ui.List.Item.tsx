import { Button, Color, Icons, css, type t } from './common';

export type ListItemProps = {
  index: number;
  item: t.DevDbItem;
  deleted?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onDeleteClick?: t.DevDbDeleteClickHandler;
};

export const ListItem: React.FC<ListItemProps> = (props) => {
  const { item, index, deleted = false, theme } = props;

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({
      color,
      fontSize: 14,
      userSelect: 'none',
      marginBottom: 8,
      display: 'grid',
      alignContent: 'center',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: '5px',
    }),
    label: css({ opacity: deleted ? 0.3 : 1 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Icons.Database size={16} offset={[1, 0]} />
      <div {...styles.label}>{item.name}</div>
      <div>
        <Button.Blue
          label={'delete'}
          enabled={item.isDeletable && !deleted}
          onClick={() => props.onDeleteClick?.({ item, index })}
        />
      </div>
    </div>
  );
};
