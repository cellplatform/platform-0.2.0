import React from 'react';
import { Color, COLORS, css, t } from '../common';

export type HarnessHostProps = {
  component?: t.SpecRenderProps;
  style?: t.CssValue;
};

export const HarnessHost: React.FC<HarnessHostProps> = (props) => {
  const { component = {} } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      pointerEvents: 'none',
      userSelect: 'none',
      backgroundColor: Color.alpha(COLORS.DARK, 0.02),
    }),
    grid: {
      fill: css({
        Absolute: 0,
        display: 'grid',
        gridTemplateColumns: `[left] 40px [body-x] 1fr [right] 40px`,
        gridTemplateRows: `[top] 40px [body-y] 1fr [bottom] 40px`,
      }),
      center: css({
        Absolute: 0,
        display: 'grid',
        gridTemplateColumns: `[left] 1fr [body-x] auto [right] 1fr`,
        gridTemplateRows: `[top] 1fr [body-y] auto [bottom] 1fr`,
      }),
    },
    block: css({
      boxSizing: 'border-box',
      border: `solid 1px ${Color.format(-0.03)}`,
      margin: 1,
      padding: 5,
    }),
    component: css({
      position: 'relative',
      pointerEvents: 'auto',
      userSelect: 'text',
      display: component.display,
      width: component.width,
      height: component.height,
      backgroundColor: Color.format(component.backgroundColor),
    }),
  };

  const elBlock = <div {...styles.block}></div>;
  const elComponent = <div {...styles.component}>{component.element}</div>;

  const elGrid = (
    <div {...styles.grid.center}>
      <div {...styles.block}>{'🎾 Harness.Host'}</div>
      {/* {elBlock} */}
      {elBlock}
      {elBlock}
      {elBlock}
      {elComponent}
      {elBlock}
      {elBlock}
      {elBlock}
      {elBlock}
    </div>
  );

  return <div {...css(styles.base, props.style)}>{elGrid}</div>;
};
