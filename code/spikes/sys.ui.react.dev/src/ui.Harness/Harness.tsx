import { useEffect, useRef, useState } from 'react';
import { Test, Color, COLORS, css, t, rx, FC } from '../common';
import { HarnessHost } from './Harness.Host';

export type HarnessProps = {
  spec?: t.BundleImport;
  style?: t.CssValue;
};

export const Harness: React.FC<HarnessProps> = (props) => {
  const [el, setEl] = useState<JSX.Element>();
  const [spec, setSpec] = useState<t.TestSuiteModel>();
  const id = spec?.id;

  /**
   * Lifecycle
   */
  useEffect(() => {
    (async () => {
      const spec = props.spec ? await Test.bundle(props.spec) : undefined;
      setSpec(spec);

      if (spec) {
        const ctx = {
          render(el: JSX.Element) {
            //
            setEl(el);
          },
        };
        const res = await spec.run({ ctx });
        console.log('res', res);
      }
    })();
  }, [id]);

  /**
   * [Render]
   */
  const styles = {
    reset: css({
      color: COLORS.DARK,
      fontFamily: 'sans-serif',
      fontSize: 16,
    }),
    base: css({
      position: 'relative',
      Flex: 'x-stretch-stretch',
    }),
    left: css({
      flex: 1,
      position: 'relative',
      display: 'flex',
    }),
    right: css({
      boxSizing: 'border-box',
      position: 'relative',
      display: 'flex',
      width: 400,
      borderLeft: `solid 1px ${Color.format(-0.1)}`,
      padding: 20, // TEMP 🐷
    }),
  };

  return (
    <div {...css(styles.reset, styles.base, props.style)}>
      <div {...styles.left}>
        <HarnessHost>{el}</HarnessHost>
      </div>
      <div {...styles.right}>
        <div>right</div>
      </div>
    </div>
  );
};
