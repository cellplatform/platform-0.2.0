import React, { useEffect, useRef, useState } from 'react';

import { COLORS, css, FC, t } from '../common.mjs';
import { Fetch } from '../Fetch.Util.mjs';
import { History } from '../History/index.mjs';

type DataCtx = {
  html: string;
  md: string;
  ast: t.MdastRoot;
};

export type AppProps = {
  style?: t.CssValue;
};

export const App: React.FC<AppProps> = (props) => {
  const [elBody, setElBody] = useState<JSX.Element | undefined>();
  const [data, setData] = useState<DataCtx>();
  const [log, setLog] = useState<t.PublicLogSummary | undefined>();

  useEffect(() => {
    (async () => {
      /**
       * Load Markdown data
       */
      const md = await Fetch.markdown('/data.md/main.md');
      const { html, markdown } = md;
      const { ast } = md.info;

      const ctx: DataCtx = { html, md: markdown, ast };
      setData(ctx);

      /**
       * Load Log (History)
       */
      const publicLog = (await Fetch.json('/log.public.json')) as t.PublicLogSummary;
      setLog(publicLog);
    })();
  }, []);

  /**
   * Render Markdown
   */
  useEffect(() => {
    (async () => {
      if (data) {
        const Markdown = await Fetch.component.Markdown();
        const el = <Markdown data={data} style={{ Absolute: 0 }} />;
        setElBody(el);
      }
    })();
  }, [data]);

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
      Absolute: [100, 240, 30, 30],
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
