import { Spec } from '../test.ui';

import { useEffect, useRef, useState } from 'react';
// import { Color, COLORS, css, t, rx } from '../common/index.mjs';
import { COLORS, t, rx } from '../common/index.mjs';
import { css, CssValue, Style, Color } from 'sys.util.css';

import { useSizeObserver } from './useSizeObserver.mjs';

export default Spec.describe('hook.useSizeObserver', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    ctx
      .size('fill', 150)
      .display('flex')
      .render(<Sample />);
  });
});

export type SampleProps = {
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const size = useSizeObserver();

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      backgroundColor: Color.format(1),
      padding: [10, 30],
    }),
  };
  return (
    <div {...css(styles.base, props.style)} ref={size.ref}>
      <pre>{JSON.stringify(size.rect, null, '..')}</pre>
    </div>
  );
};
