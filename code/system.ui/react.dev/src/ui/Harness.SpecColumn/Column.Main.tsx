import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type SpecColumnMainProps = {
  results?: t.TestSuiteRunResponse;
  renderProps?: t.SpecRenderProps;
  style?: t.CssValue;
};

export const SpecColumnMain: React.FC<SpecColumnMainProps> = (props) => {
  const { renderProps } = props;

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
