import { useEffect, useRef, useState } from 'react';

import { Color, COLORS, css, Fetch, rx, State, t, Time } from '../common.mjs';
import { History } from '../History/index.mjs';
import { Markdown } from '../Markdown/index.mjs';
import { RootTitle } from './Root.Title';

export type ShowMarkdownComponent = 'editor' | 'outline';

export type RootProps = {
  style?: t.CssValue;
};

export const Root: React.FC<RootProps> = (props) => {
  const [log, setLog] = useState<t.PublicLogSummary>();

  const busRef = useRef(rx.bus());
  const bus = busRef.current;
  const instance: t.StateInstance = { bus };

  useEffect(() => {
    /**
     * 💦💦
     *
     *    Initialize controller and fetch report [Outline].
     *
     * 💦
     */
    const controller = State.Bus.Controller({ instance });
    controller.init();

    /**
     * Ensure state is retained between HMR (relaods).
     * Ref:
     *    https://vitejs.dev/guide/api-hmr.html#hmr-api
     */
    import.meta.hot?.on('vite:beforeUpdate', (e) => {
      Time.delay(0, () => controller.init());
    });

    (async () => {
      /**
       * TODO 🐷
       * - move Log fetch into State contorller.
       */
      const log = await Fetch.logHistory();
      setLog(log);
    })();
  }, []);

  /**
   * [Render]
   */
  const styles = {
    normalize: css({ fontFamily: 'sans-serif', color: COLORS.DARK }),
    base: css({
      Absolute: 0,
      Flex: 'x-stretch-stretch',
      boxSizing: 'border-box',
    }),
    left: css({
      flex: 1,
      Flex: 'y-stretch-stretch',
    }),
    right: css({
      width: 200,
      borderLeft: `solid 1px ${Color.format(-0.1)}`,
    }),

    /**
     * Content
     */
    history: { flex: 1 },
    body: css({ position: 'relative', flex: 1 }),
  };

  return (
    <div {...css(styles.base, styles.normalize, props.style)}>
      <div {...styles.left}>
        <RootTitle text={'Report'} />
        <div {...styles.body}>
          <Markdown instance={instance} location={location.href} style={{ Absolute: 0 }} />
        </div>
      </div>
      <div {...styles.right}>
        <History instance={instance} style={styles.history} data={log} />
      </div>
    </div>
  );
};
