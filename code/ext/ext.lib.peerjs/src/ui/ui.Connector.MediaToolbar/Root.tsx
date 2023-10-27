import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Button, Icons } from './common';

const View: React.FC<t.MediaToolbarProps> = (props) => {
  const connectMedia = async () => {};
  const stopMedia = async () => {};

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    tmp: css({ fontSize: 11 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.tmp}>
        <Button onClick={connectMedia}>{'🐷'}</Button>
        <Button onClick={stopMedia}>{'🐷'}</Button>
      </div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const MediaToolbar = FC.decorate<t.MediaToolbarProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Connector.MediaToolbar' },
);
