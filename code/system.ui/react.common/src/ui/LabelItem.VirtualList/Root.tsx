import { Virtuoso } from 'react-virtuoso';
import { DEFAULTS, FC, LabelItem, css, type t } from './common';

const View: React.FC<t.RootProps> = (props) => {
  const { list, renderers } = props;
  const { Provider, ref, handlers } = LabelItem.Stateful.useListController({ list });
  const total = list?.current.total ?? 0;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
    }),
  };

  return (
    <Provider>
      <div ref={ref} {...css(styles.base, props.style)}>
        <Virtuoso
          totalCount={total}
          overscan={50}
          itemContent={(i) => {
            const [item] = LabelItem.Model.List.getItem(list, i);
            if (!item) return null;
            return (
              <LabelItem.Stateful
                {...handlers}
                key={item.instance}
                index={i}
                total={length}
                list={list}
                item={item}
                renderers={renderers}
              />
            );
          }}
        />
      </div>
    </Provider>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Root = FC.decorate<t.RootProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'LabelItem.VirtualList' },
);
