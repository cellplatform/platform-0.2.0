import { useEffect, useState, useRef } from 'react';

import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { DEFAULTS, FC, LabelItem, css, type t } from './common';

const View: React.FC<t.VirtualListProps> = (props) => {
  const { list, renderers } = props;
  const { Provider, ref, handlers } = LabelItem.Stateful.useListController({ list });
  const total = list?.current.total ?? 0;

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const ref = virtuosoRef.current;
    if (ref) props.onReady?.({ ref });
  }, [virtuosoRef.current]);

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
      <div ref={ref} {...css(styles.base, props.style)}>
        <Virtuoso
          ref={virtuosoRef}
          totalCount={total}
          overscan={50}
          itemContent={(index) => {
            const [item] = LabelItem.Model.List.getItem(list, index);
            if (!item) return null;
            return (
              <LabelItem.Stateful
                {...handlers}
                key={item.instance}
                index={index}
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
export const VirtualList = FC.decorate<t.VirtualListProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'LabelItem.VirtualList' },
);
