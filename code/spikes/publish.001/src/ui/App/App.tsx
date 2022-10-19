import React, { useEffect, useRef, useState } from 'react';
import { COLORS, css, t, rx, FC } from '../common.mjs';
import { Pkg } from '../../index.pkg.mjs';
import { FetchUtil } from './Fetch.Util.mjs';

type DataCtx = {
  html: string;
  md: string;
  ast: t.MdastRoot;
};

export type AppProps = {
  style?: t.CssValue;
};

// console.info(`Pkg`, Pkg);

export const App: React.FC<AppProps> = (props) => {
  const [el, setElement] = useState<JSX.Element | undefined>();
  const [data, setData] = useState<DataCtx>();
  const [publicLog, setPublicLog] = useState<t.PublicLogSummary | undefined>();

  // const f: t.BundlePaths

  useEffect(() => {
    (async () => {
      /**
       * Load Markdown data
       */
      const md = await FetchUtil.markdown('/data.md/main.md');
      const { html, markdown } = md;
      const { ast } = md.info;

      const ctx: DataCtx = { html, md: markdown, ast };
      setData(ctx);

      /**
       * Load Log (History)
       */
      const publicLog = (await FetchUtil.json('/log.public.json')) as t.PublicLogSummary;
      setPublicLog(publicLog);

      console.log('logJson', publicLog);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      /**
       * NOTE: Code Splitting
       */
      const m = await import('./App.Markdown');
      const el = data && (
        <div {...styles.md}>
          <m.AppMarkdown data={data} />
        </div>
      );
      setElement(el);
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
      padding: [30, 70],
    }),

    body: css({
      Absolute: [100, 30, 30, 30],
      Flex: 'x-stretch-stretch',
    }),

    left: css({
      flex: 1,
    }),
    right: css({
      width: 300,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),

    /**
     * Content
     */
    title: css({
      Absolute: [30, 30, null, 30],
      fontSize: 30,
    }),
    md: css({
      Absolute: 0,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>🇺🇳 Report</div>

      <div {...styles.body}>
        <div {...styles.left}>{el}</div>

        <div {...styles.right}>
          {publicLog?.history.map((item, i) => {
            const { version } = item;
            return <div key={i}>{version}</div>;
          })}
        </div>
      </div>
    </div>
  );
};
