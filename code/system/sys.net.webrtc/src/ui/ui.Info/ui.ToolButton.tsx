import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, Button } from './common';

export type ToolButtonProps = {
  children?: JSX.Element;
  enabled?: boolean;
  style?: t.CssValue;
  onClick?: () => void;
};

export const ToolButton: React.FC<ToolButtonProps> = (props) => {
  const { enabled = true } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      placeItems: 'center',
      PaddingX: 5,
    }),
    inner: css({
      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <Button isEnabled={enabled} style={css(styles.base, props.style)} onClick={props.onClick}>
      <div {...styles.inner}>{props.children}</div>
    </Button>
  );
};
