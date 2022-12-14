import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type SpecColumnMainProps = {
  results?: t.TestSuiteRunResponse;
  renderProps?: t.SpecRenderProps;
  style?: t.CssValue;
};

let _count = 0;

export const SpecColumnMain: React.FC<SpecColumnMainProps> = (props) => {
  const { renderProps } = props;
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

    DEBUG_JSON: css({
      fontSize: 13,
    }),
  };

  const list = renderProps?.debug.main.elements ?? [];
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

      <div {...styles.DEBUG_JSON}>
        {/* <pre>renderProps: {JSON.stringify(renderProps, null, '..')}</pre> */}
      </div>
    </div>
  );
};
