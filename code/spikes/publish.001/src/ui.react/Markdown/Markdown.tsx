import { State, QueryString } from '../../ui.logic/index.mjs';
import { css, t } from '../common.mjs';
import { MarkdownDoc } from '../Markdown.Doc/index.mjs';
import { MarkdownEditor } from '../Markdown.Editor/index.mjs';
import { MarkdownLayout } from '../Markdown.Layout/index.mjs';
import { TileOutline } from '../Tile.Outline/index.mjs';

export type MarkdownProps = {
  instance: t.StateInstance;
  style?: t.CssValue;
};

export const Markdown: React.FC<MarkdownProps> = (props) => {
  const { instance } = props;

  const state = State.Bus.useEvents(props.instance);
  const show = QueryString.show(state.current?.location?.url);

  if (!state.current) return null;

  console.log('-------------------------------------------');
  console.log('Markdown/state:', state.current);

  /**
   * Handlers
   */
  const onEditorChange = (e: { text: string }) => {
    State.events(instance, async (events) => {
      await events.change.fire((state) => {
        const markdown = state.markdown ?? (state.markdown = {});
        markdown.outline = e.text;
      });
    });
  };

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

    const markdown = state.current?.markdown;
    const outline = markdown?.outline;
    const document = markdown?.document;

    console.log(' > ', i); // TEMP 🐷

    if (kind === 'outline') {
      flex = undefined;
      el = <TileOutline markdown={outline} scroll={true} style={{ flex: 1, padding: 40 }} />;
    }

    if (kind === 'doc') {
      flex = 1;
      el = <MarkdownDoc markdown={document} scroll={true} style={{ flex: 1 }} />;
    }

    if (kind === 'outline|doc') {
      flex = 2;
      el = (
        <MarkdownLayout
          markdown={{ outline, document }}
          scroll={true}
          style={{ flex: 1 }}
          onSelectClick={(e) => {
            State.events(instance, (state) => state.select.fire(e.ref?.url));
          }}
        />
      );
    }

    if (kind === 'editor') {
      flex = 1;
      el = (
        <MarkdownEditor
          key={i}
          style={{ flex: 1 }}
          markdown={outline}
          onChange={onEditorChange}
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
