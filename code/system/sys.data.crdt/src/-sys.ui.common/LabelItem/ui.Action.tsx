import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Button, Icons } from './common';

import { Wrangle } from './Wrangle';

export type ActionProps = {
  action: t.LabelAction;
  enabled?: boolean;
  selected?: boolean;
  focused?: boolean;
  opacity?: number;
  style?: t.CssValue;
};

export const Action: React.FC<ActionProps> = (props) => {
  const { action, focused } = props;
  const { onClick } = action;
  const isButton = onClick && (action.enabled ?? true);
  const isEnabled = action.enabled ?? props.enabled ?? DEFAULTS.enabled;
  const opacity = props.opacity ?? (isEnabled ? 1 : 0.3);

  /**
   * [Handlers]
   */
  const handleClick = () => {
    onClick?.({ kind: action.kind });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      opacity,
      width: action.width,
      display: 'grid',
      placeItems: 'center',
    }),
    button: css({ display: 'grid', placeItems: 'center' }),
  };

  const elIcon = Wrangle.icon(props);
  const elButton = isButton && (
    <Button onClick={handleClick} isEnabled={isEnabled} disabledOpacity={1}>
      <div {...styles.button}>{elIcon}</div>
    </Button>
  );

  return <div {...css(styles.base, props.style)}>{elButton || elIcon}</div>;
};
