import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, Button, Spinner } from './common';

export type ToolButtonProps = {
  clickable?: boolean;
  children?: JSX.Element;
  enabled?: boolean;
  selected?: boolean;
  tooltip?: string;
  spinning?: boolean;
  style?: t.CssValue;
  paddingX?: [number, number];
  spinnerColor?: string | number;
  onClick?: () => void;
};

export const ToolButton: React.FC<ToolButtonProps> = (props) => {
  const { clickable = true, selected = false, spinning = false, paddingX = [5, 5] } = props;
  const enabled = clickable && (props.enabled ?? true);
  const disabledOpacity = clickable ? 0.3 : 1;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
    }),
    body: css({
      marginLeft: paddingX[0],
      marginRight: paddingX[1],
    }),
    children: css({
      display: 'grid',
      placeItems: 'center',
      opacity: spinning ? 0 : 1,
      transition: `opacity 0.15s ease`,
    }),
    spinner: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elSpinner = spinning && (
    <div {...styles.spinner}>
      <Spinner.Bar width={16} color={props.spinnerColor ?? COLORS.DARK} />
    </div>
  );

  return (
    <Button
      isEnabled={enabled}
      disabledOpacity={disabledOpacity}
      tooltip={props.tooltip}
      style={css(styles.base, props.style)}
      onClick={props.onClick}
    >
      <div {...styles.body}>
        <div {...styles.children}>{props.children}</div>
        {elSpinner}
      </div>
    </Button>
  );
};
