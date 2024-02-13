import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, PropList } from './common';

export const List: React.FC<t.ModuleNamespaceListProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      display: 'grid',
    }),
  };

  const items: t.PropListItem[] = [
    { label: 'foo', value: 'bar' },
    { label: 'foo', value: 'bar' },
    { label: 'foo', value: 'bar' },
  ];

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 `}</div>
      <PropList items={items} />
    </div>
  );
};
