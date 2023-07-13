import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from '../common';

const View: React.FC<t.LabelItemStatefulProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 LabelItemStateful`}</div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'LabelItem.Stateful' },
);
