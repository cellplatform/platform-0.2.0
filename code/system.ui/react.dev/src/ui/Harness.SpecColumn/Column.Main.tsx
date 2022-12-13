import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type SpecColumnMainProps = {
  instance: t.DevInstance;
  results?: t.TestSuiteRunResponse;
  renderArgs?: t.SpecRenderArgs;
  style?: t.CssValue;
};

let _count = 0;

export const SpecColumnMain: React.FC<SpecColumnMainProps> = (props) => {
  const { instance, renderArgs } = props;
  _count++;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    item: css({
      position: 'relative',
    }),
  };

  const list = renderArgs?.debug.main.elements ?? [];
  const elements = list.filter(Boolean).map((el, i) => {
    return (
      <div key={i} {...styles.item}>
        {el}
        <div>render count: {_count}</div>
      </div>
    );
  });

  return (
    <div {...css(styles.base, props.style)}>
      <div>{elements}</div>
    </div>
  );
};
