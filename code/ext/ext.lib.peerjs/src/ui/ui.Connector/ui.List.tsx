import { LabelItem, RenderCount, css, type t } from './common';

export type ListProps = {
  list: t.LabelListState;
  debug?: { renderCount?: t.RenderCountProps };
  style?: t.CssValue;
};

export const List: React.FC<ListProps> = (props) => {
  const { list, debug = {} } = props;
  const { ref, Provider, handlers } = LabelItem.Stateful.useListController({ list });

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  const elements = LabelItem.Model.List.map(list, (item, index) => {
    return (
      <LabelItem.Stateful
        //
        {...handlers}
        key={item.instance}
        index={index}
        list={list}
        item={item}
      />
    );
  });

  const dataid = `Connector:List:${list.instance}`;
  return (
    <Provider>
      <div ref={ref} data-id={dataid} {...css(styles.base, props.style)}>
        {debug.renderCount && <RenderCount {...debug.renderCount} />}
        <div>{elements}</div>
      </div>
    </Provider>
  );
};
