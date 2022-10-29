import { useEffect, useRef, useState } from 'react';

import { BundlePaths, css, FC, Fetch, Path, t } from '../common.mjs';
import { MarkdownDoc } from '../Markdown.Doc/index.mjs';
import { MarkdownOutline, HeadingTileClickHandler } from '../Markdown.Outline/index.mjs';

export type MarkdownLayoutProps = {
  markdown?: string;
  selectedUrl?: string;
  scroll?: boolean;
  style?: t.CssValue;
  onSelectClick?: HeadingTileClickHandler;
};

export const MarkdownLayout: React.FC<MarkdownLayoutProps> = (props) => {
  const { markdown } = props;

  /**
   * TODO 🐷
   * - Move to root [ui.logic:State]
   */
  const [selectedMarkdown, setSelectedMarkdown] = useState('');

  const loadChild = async (args: { url: string }) => {
    /**
     * 💦💦
     *
     *    STATE LOADING
     *
     * 💦
     */

    /**
     * TODO 🐷 - move into root state.
     */
    const path = Path.toAbsolutePath(Path.join(BundlePaths.data.md, args.url));
    const md = await Fetch.markdown(path);
    setSelectedMarkdown(md.markdown);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Scroll: props.scroll,
      Flex: 'y-stretch-stretch',
    }),
    body: {
      base: css({ flex: 1, Flex: 'x-stretch-stretch' }),
      left: { position: 'relative' },
      main: css({
        flex: 2,
        position: 'relative',
        padding: 20,
        paddingLeft: 20,
        paddingRight: 40,
        boxSizing: 'border-box',
      }),
    },
    footer: {
      base: css({}),
      inner: css({ height: 100 }),
    },
    outline: css({
      marginTop: 20,
      marginLeft: 20,
    }),
  };

  const elBody = (
    <div {...styles.body.base}>
      <div {...styles.body.left}>
        <MarkdownOutline
          style={styles.outline}
          widths={{ root: 250, child: 300 }}
          markdown={markdown}
          onClick={(e) => {
            const ref = e.ref;
            // e.ref.

            // TEMP 🐷
            // if (ref?.url) loadChild({ url: ref.url });
            // if (!ref?.url) setSelectedMarkdown('');

            props.onSelectClick?.(e);
          }}
        />
      </div>
      <div {...styles.body.main}>
        <MarkdownDoc markdown={selectedMarkdown} />
      </div>
    </div>
  );

  const elFooter = (
    <div {...styles.footer.base}>
      <div {...styles.footer.inner} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elBody}
      {elFooter}
    </div>
  );
};
