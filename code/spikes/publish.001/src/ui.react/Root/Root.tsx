import { useEffect, useState } from 'react';

import { Color, COLORS, css, t } from '../common.mjs';
import { Fetch } from '../Fetch.mjs';
import { History } from '../History/index.mjs';
import { MarkdownUtil } from '../Markdown/index.mjs';
import { State, BundlePaths } from '../../ui.logic/index.mjs';
import { RootTitle } from './Root.Title';

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
      const { info } = await MarkdownUtil.parseMarkdown(markdown);

      // TODO 🐷 move to [State]
      const data: t.StateMarkdown = {
        markdown,
        info,
      };

      const el = (
        <Markdown
          data={data}
          markdown={markdown}
          location={location.href}
          style={{ Absolute: 0 }}
        />
      );
      setElBody(el);
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
        <div {...styles.body}>{elBody}</div>
      </div>
      <div {...styles.right}>
        <History style={styles.history} data={log} />
      </div>
    </div>
  );
};
