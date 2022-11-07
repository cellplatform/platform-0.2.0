import { css, FC, t } from '../common.mjs';
import { MarkdownDoc } from '../Markdown.Doc/index.mjs';
import { HeadingTileClickHandler, TileOutline } from '../Tile.Outline/index.mjs';
import { Center } from './Center';

export type MarkdownLayoutProps = {
  markdown?: { outline?: string; document?: string };
  selectedUrl?: string;
  scroll?: boolean;
  style?: t.CssValue;
  onSelectClick?: HeadingTileClickHandler;
};

export const MarkdownLayout: React.FC<MarkdownLayoutProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Scroll: props.scroll,
      // Flex: 'y-stretch-stretch',
    }),
    body: {
      base: css({
        flex: 1,
        Flex: 'x-stretch-stretch',
      }),
      left: { position: 'relative' },
      main: css({
        flex: 2,
        position: 'relative',
        padding: 20,
        paddingLeft: 80,
        paddingRight: 40,
        boxSizing: 'border-box',
      }),
    },
    footer: {
      base: css({}),
      inner: css({ height: 100 }),
    },
    outline: css({ marginTop: 20, marginLeft: 20 }),
  };

  const elBody = (
    <div {...styles.body.base}>
      <div {...styles.body.left}>
        <TileOutline
          style={styles.outline}
          widths={{ root: 250, child: 300 }}
          markdown={props.markdown?.outline}
          selectedUrl={props.selectedUrl}
          onClick={props.onSelectClick}
        />
      </div>
      <div {...styles.body.main}>
        <MarkdownDoc markdown={props.markdown?.document} />
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
      <Center>{elBody}</Center>
      {elFooter}
    </div>
  );
};
