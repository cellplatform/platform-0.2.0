import type { t } from './common';

import { useEffect } from 'react';
import { LabelItem, Virtuoso, css } from './common';
import { useHandle } from './use.HandleRef';

export const View: React.FC<t.VirtualListProps> = (props) => {
  const { list, renderers } = props;
  const total = list?.current.total ?? 0;

  const handle = useHandle();
  const listController = LabelItem.Stateful.useListController({ list });

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (handle.ready) props.onReady?.({ vlist: handle.list });
  }, [handle.ref.current]);

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
    <listController.Provider>
      <div ref={listController.ref} {...css(styles.base, props.style)}>
        <Virtuoso
          ref={handle.ref}
          totalCount={total}
          overscan={50}
          itemContent={(index) => {
            const [item] = LabelItem.Model.List.getItem(list, index);
            if (!item) return null;
            return (
              <LabelItem.Stateful
                {...listController.handlers}
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
    </listController.Provider>
  );
};
