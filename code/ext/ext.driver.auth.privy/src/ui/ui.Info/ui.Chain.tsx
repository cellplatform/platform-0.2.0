import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type ChainProps = {
  name: string;
  modifiers: t.InfoFieldModifiers;
  enabled?: boolean;
  style?: t.CssValue;
};

export const Chain: React.FC<ChainProps> = (props) => {
  const { enabled = true, name, modifiers } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: '5px',
    }),
    selection: {
      base: css({
        width: 15,
        backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
        display: 'grid',
        placeItems: 'center',
      }),
      dot: css({
        Size: 6,
        backgroundColor: COLORS.BLUE,
        borderRadius: 20,
      }),
    },
    name: css({
      opacity: 0.5,
    }),
  };

  const elDot = <div {...styles.selection.dot} />;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.selection.base}>{elDot}</div>
      <div {...styles.name}>{name}</div>
    </div>
  );
};
