import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC, Path } from '../common.mjs';
import { MarkdownOutline } from '../Markdown.Outline/index.mjs';
import { MarkdownDoc } from '../Markdown.Doc/index.mjs';
import { State, BundlePaths } from '../../ui.logic/index.mjs';
import { Fetch } from '../Fetch.mjs';

export type MarkdownLayoutProps = {
  markdown?: string;
  scroll?: boolean;
  style?: t.CssValue;
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
          widths={{ root: 280, child: 280 }}
          markdown={markdown}
          onClick={(e) => {
            const ref = e.ref;
            if (ref?.url) loadChild({ url: ref.url });
            if (!ref?.url) setSelectedMarkdown('');
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
