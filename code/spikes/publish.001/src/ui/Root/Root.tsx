import React, { useEffect, useState } from 'react';

import { COLORS, css, t } from '../common.mjs';
import { Fetch } from '../Fetch.Util.mjs';
import { History } from '../History/index.mjs';

export type AppProps = {
  style?: t.CssValue;
};

export const App: React.FC<AppProps> = (props) => {
  const [elBody, setElBody] = useState<JSX.Element | undefined>();

  const [log, setLog] = useState<t.PublicLogSummary | undefined>();

  useEffect(() => {
    (async () => {
      /**
       * Load markdown data
       */
      const md = await Fetch.markdown('/data.md/outline.md');

      /**
       * Load log (history)
       */
      const publicLog = (await Fetch.json('/log.public.json')) as t.PublicLogSummary;
      setLog(publicLog);

      /**
       * Load <Markdown> component (code-splitting)
       */
      const Markdown = await Fetch.component.Markdown();
      const el = <Markdown markdown={md.markdown} style={{ Absolute: 0 }} />;
      setElBody(el);
    })();
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      fontFamily: 'sans-serif',
      color: COLORS.DARK,
    }),

    /**
     * Content
     */
    title: css({
      Absolute: [30, 240, null, 30],
      fontSize: 30,
    }),

    history: {
      Absolute: [0, 0, 0, null],
      width: 200,
    },

    body: css({
      Absolute: [100, 240, 30, 12],
      Flex: 'x-stretch-stretch',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>🇺🇳 Report</div>
      <div {...styles.body}>{elBody}</div>
      <History style={styles.history} data={log} />
    </div>
  );
};
