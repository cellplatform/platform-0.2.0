import React, { useEffect, useState } from 'react';

import { Color, COLORS, css, t } from '../common.mjs';
import { Fetch } from '../Fetch.mjs';
import { History } from '../History/index.mjs';
import { MarkdownUtil } from '../Markdown/index.mjs';
import { State, BundlePaths } from '../../ui.logic/index.mjs';

export type ShowMarkdownComponent = 'editor' | 'outline';

export type RootProps = {
  style?: t.CssValue;
};

export const Root: React.FC<RootProps> = (props) => {
  const [elBody, setElBody] = useState<JSX.Element>();
  const [log, setLog] = useState<t.PublicLogSummary>();

  useEffect(() => {
    (async () => {
      /**
       * Load markdown data
       */
      // const md = await Fetch.markdown('/data.md/outline.md');
      const md = await Fetch.markdown(BundlePaths.data.md + 'outline.md');

      /**
       * Load log (history)
       */
      const logdir = BundlePaths.data.log;
      const log = await Fetch.json<t.PublicLogSummary>(logdir);
      setLog(log);

      /**
       * Load <Markdown> component (code-splitting)
       */
      const location = State.location;
      const Markdown = await Fetch.component.Markdown();
      const markdown = MarkdownUtil.ensureTrailingNewline(md.markdown);

      const el = <Markdown markdown={markdown} location={location.href} style={{ Absolute: 0 }} />;
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
      Absolute: [90, 200, 0, 0],
      borderTop: `solid 15px ${Color.alpha(COLORS.DARK, 0.06)}`,
    }),
    bodyInner: css({
      Absolute: 0,
      Flex: 'x-stretch-stretch',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>Report</div>
      <div {...styles.body}>
        <div {...styles.bodyInner}>{elBody}</div>
      </div>
      <History style={styles.history} data={log} />
    </div>
  );
};
