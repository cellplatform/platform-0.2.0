import { LabelItem, RenderCount, css, type t } from './common';

export type ListProps = {
  items?: t.ConnectorListItem[];
  list?: t.LabelItemListState;
  style?: t.CssValue;
};

export const List: React.FC<ListProps> = (props) => {
  const { items = [] } = props;
  const controller = LabelItem.Stateful.useListController({
    list: props.list,
    items: items.map(({ state }) => state),
  });

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      outline: 'none',
    }),
  };

  const elements = items.map((item, i) => {
    return (
      <LabelItem.Stateful
        key={`item.${i}`}
        index={i}
        total={length}
        list={controller.list}
        item={item.state}
        renderers={item.renderers}
      />
    );
  });

  return (
    <div ref={controller.ref} {...css(styles.base, props.style)} tabIndex={0}>
      <RenderCount absolute={[-20, 0, null, null]} />
      <div>{elements}</div>
    </div>
  );
};
