import type { VirtuosoHandle, t } from './common';

import { RefObject } from 'react';
import { DEFAULTS, LabelItem, Virtuoso, css } from './common';

type ListProps = t.VirtualListProps & { virtuosoRef: RefObject<VirtuosoHandle> };

export const List: React.FC<ListProps> = (props) => {
  const { list, renderers, overscan = DEFAULTS.overscan, tabIndex = DEFAULTS.tabIndex } = props;
  const total = list?.current.total ?? 0;

  const { Provider, ref, handlers } = LabelItem.Stateful.useListController({ list });

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
    }),
  };

  return (
    <Provider>
      <div ref={ref} {...css(styles.base, props.style)} tabIndex={tabIndex}>
        <Virtuoso
          ref={props.virtuosoRef}
          totalCount={total}
          overscan={overscan}
          itemContent={(index) => {
            const [item] = LabelItem.Model.List.getItem(list, index);
            if (!item) return null;

            return (
              <LabelItem.Stateful
                {...handlers}
                key={item.instance}
                index={index}
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
