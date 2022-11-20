import { Color, COLORS, css, State, t } from '../common';
import { MarkdownEditor } from '../Markdown.Editor/index.mjs';
import { MarkdownLayout } from '../Markdown.Layout/index.mjs';
import { useEditorChangeHandler } from './useEditorChangeHandler.mjs';

export type MarkdownProps = {
  instance: t.Instance;
  showEditor?: boolean;
  style?: t.CssValue;
};

export const Markdown: React.FC<MarkdownProps> = (props) => {
  const { instance, showEditor = false } = props;

  const changeMonitor = useEditorChangeHandler(props.instance);
  const state = changeMonitor.state;
  if (!state) return null;

  const version = state.log?.latest.version;
  const selectedUrl = state?.selection.index?.path;
  const markdown = state?.markdown;
  const outline = markdown?.outline;
  const document = markdown?.document;

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

  const elLayout = (
    <MarkdownLayout
      style={{ flex: 1 }}
      instance={instance}
      markdown={{ outline, document }}
      loading={{ document: Boolean(state.loading.document) }}
      overlay={state.overlay?.def}
      version={version}
      selectedUrl={selectedUrl}
      onSelectClick={(e) => {
        const url = e.ref?.url;
        State.withEvents(instance, (state) => state.select.fire(url));
      }}
    />
  );

  const elEditor = showEditor && (
    <MarkdownEditor
      style={{
        flex: 1,
        borderLeft: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      }}
      markdown={selectedUrl ? markdown?.document : markdown?.outline}
      onChange={changeMonitor.changeHandler}
      focusOnLoad={true}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elLayout}
      {elEditor}
    </div>
  );
};
