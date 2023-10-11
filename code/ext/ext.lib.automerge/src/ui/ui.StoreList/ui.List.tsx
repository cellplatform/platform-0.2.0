import { LabelItem, RenderCount, css, type t } from './common';

export type ListProps = {
  list?: t.LabelListState;
  items?: t.StoreItemState[];
  renderers?: t.StoreItemRenderers;
  style?: t.CssValue;
  renderCount?: t.RenderCountProps;
};

export const List: React.FC<ListProps> = (props) => {
  const { list, items = [] } = props;
  const controller = LabelItem.Stateful.useListController({ list, items });

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', outline: 'none' }),
  };

  const elements = items.map((item, i) => {
    return (
      <LabelItem.Stateful
        key={`item.${i}`}
        index={i}
        total={length}
        list={controller.list}
        item={item}
        renderers={props.renderers}
      />
    );
  });

  return (
    <div ref={controller.ref} {...css(styles.base, props.style)} tabIndex={0}>
      {props.renderCount && <RenderCount {...props.renderCount} />}
      <div>{elements}</div>
    </div>
  );
};
