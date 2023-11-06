import { LabelItem, RenderCount, css, type t } from './common';

export type ListProps = {
  list?: t.LabelListState;
  renderers?: t.RepoItemRenderers;
  style?: t.CssValue;
  renderCount?: t.RenderCountProps;
};

export const List: React.FC<ListProps> = (props) => {
  const { list } = props;
  const { Provider, ref, handlers } = LabelItem.Stateful.useListController({ list });

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
        renderers={props.renderers}
      />
    );
  });

  return (
    <Provider>
      <div ref={ref} {...css(styles.base, props.style)}>
        {props.renderCount && <RenderCount {...props.renderCount} />}
        <div>{elements}</div>
      </div>
    </Provider>
  );
};
