import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

import { Virtuoso } from 'react-virtuoso';

const View: React.FC<t.RootProps> = (props) => {
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
    <div {...css(styles.base, props.style)}>
      <Virtuoso
        style={{}}
        totalCount={200}
        overscan={50}
        itemContent={(index) => <div>Item {index}</div>}
      />
    </div>
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
