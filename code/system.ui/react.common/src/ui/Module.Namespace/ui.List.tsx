import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, PropList } from './common';
import { Wrangle } from './u.Wrangle';

export const List: React.FC<t.ModuleNamespaceListProps> = (props) => {
  const is = Wrangle.is(props);

  /**
   * Render
   */
  const color = is.dark ? COLORS.WHITE : COLORS.DARK;
  const styles = {
    base: css({
      display: 'grid',
      color,
    }),
  };

  /**
   * TODO 🐷
   */
  const items: t.PropListItem[] = [
    { label: 'foo', value: 'foo.bar' },
    { label: 'foo', value: 'foo.bar.baz' },
    { label: 'foo', value: 'foo.bar.zoo' },
  ];

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 `}</div>
      <PropList items={items} theme={props.theme} />
    </div>
  );
};
