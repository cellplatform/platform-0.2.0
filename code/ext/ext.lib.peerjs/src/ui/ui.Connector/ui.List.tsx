import { LabelItem, RenderCount, css, type t } from './common';

export type ListProps = {
  list?: t.LabelListState;
  renderers?: t.LabelItemRenderers;
  debug?: { renderCount?: t.RenderCountProps };
  style?: t.CssValue;
};

export const List: React.FC<ListProps> = (props) => {
  const { list, renderers, debug = {} } = props;
  const { ref, Provider, handlers } = LabelItem.Stateful.useListController({ list });

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  const elements = LabelItem.Model.List.map(list, (item, i) => {
    return (
      <LabelItem.Stateful
        {...handlers}
        key={item.instance}
        index={i}
        list={list}
        item={item}
        renderers={renderers}
      />
    );
  });

  return (
    <Provider>
      <div ref={ref} {...css(styles.base, props.style)}>
        {debug.renderCount && <RenderCount {...debug.renderCount} />}
        <div>{elements}</div>
      </div>
    </Provider>
  );
};
