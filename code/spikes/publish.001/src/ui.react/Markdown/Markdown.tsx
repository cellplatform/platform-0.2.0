import { COLORS, Color, css, t, State, QueryString } from '../common';
import { MarkdownDoc } from '../Markdown.Doc/index.mjs';
import { MarkdownEditor } from '../Markdown.Editor/index.mjs';
import { MarkdownLayout } from '../Markdown.Layout/index.mjs';
import { TileOutline } from '../Tile.Outline/index.mjs';
import { useEditorChangeHandler } from './useEditorChangeHandler.mjs';

export type MarkdownProps = {
  instance: t.StateInstance;
  style?: t.CssValue;
};

export const Markdown: React.FC<MarkdownProps> = (props) => {
  const { instance } = props;

  const changeMonitor = useEditorChangeHandler(props.instance);
  const state = changeMonitor.state;

  if (!state) return null;

  const url = state.location?.url;
  const version = state.log?.latest.version;

  /**
   * TODO 🐷
   * - remove this concept of "show" (from the query-string)
   * - only need `isDev` to show/hide dev-env (and editor).
   */
  const show = QueryString.show(url);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      Flex: 'x-stretch-stretch',
      overflow: 'hidden',
    }),
    column: css({ display: 'flex' }),
  };

  const elements = show.map((kind, i) => {
    let el: JSX.Element | null = null;
    let flex: undefined | number;

    const selectedUrl = state?.selection.index?.path;
    const markdown = state?.markdown;
    const outline = markdown?.outline;
    const document = markdown?.document;

    if (kind === 'outline') {
      flex = undefined;
      el = (
        <TileOutline
          selectedUrl={selectedUrl}
          markdown={outline}
          scroll={true}
          style={{ flex: 1, padding: 40 }}
        />
      );
    }

    if (kind === 'doc') {
      flex = 1;
      el = <MarkdownDoc markdown={document} scroll={true} style={{ flex: 1 }} />;
    }

    if (kind === 'outline|doc') {
      flex = 2;
      el = (
        <MarkdownLayout
          style={{ flex: 1 }}
          markdown={{ outline, document }}
          version={version}
          selectedUrl={selectedUrl}
          onSelectClick={(e) => {
            const url = e.ref?.url;
            State.events(instance, (state) => state.select.fire(url));
          }}
        />
      );
    }

    if (kind === 'editor') {
      flex = 1;
      const text = selectedUrl ? markdown?.document : markdown?.outline;
      el = (
        <MarkdownEditor
          key={i}
          style={{
            flex: 1,
            borderLeft: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
          }}
          markdown={text}
          onChange={changeMonitor.changeHandler}
          focusOnLoad={true}
        />
      );
    }

    return (
      <div key={i} {...css(styles.column, { flex })}>
        {el ?? null}
      </div>
    );
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};
