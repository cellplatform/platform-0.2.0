import { Color, COLORS, Center, css, DEFAULTS, t } from '../common';
import { MarkdownDoc } from '../Markdown.Doc';

const CLASS = DEFAULTS.MD.CLASS;

export type VideoDiagramMarkdownProps = {
  instance: t.Instance;
  dimmed?: boolean;
  def: t.DocDiagramMarkdownType;
  status?: t.VimeoStatus;
  style?: t.CssValue;
};

export const VideoDiagramMarkdown: React.FC<VideoDiagramMarkdownProps> = (props) => {
  const { instance, def, dimmed = false } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      opacity: dimmed ? 0.1 : 1,
      transition: `opacity 300ms`,
      Flex: 'x-stretch-stretch',
    }),

    title: css({
      fontSize: 32,
      paddingLeft: 30,
      paddingTop: 22,
    }),

    body: css({
      flex: 1,
      position: 'relative',
      display: 'grid',
      gridTemplateRows: `[title] ${def.title ? 80 : 0}px [body] 1fr`,
      marginBottom: 50,
    }),

    markdown: css({}),

    rightSidebar: css({
      position: 'relative',
      width: 300,
      marginTop: 20,
      marginBottom: 50,
      Padding: [10, 15],
      borderLeft: `dashed 2px ${Color.alpha(COLORS.DARK, 0.2)}`,
    }),
  };

  const elTitle = def.title && <div {...styles.title}>{def.title}</div>;

  const elMarkdown = (
    <div {...styles.markdown} className={CLASS.ROOT}>
      <Center className={CLASS.BLOCK} style={{ Absolute: [0, 120], paddingBottom: '6%' }}>
        <MarkdownDoc instance={instance} markdown={def.markdown} className={CLASS.VIDEO_DIAGRAM} />
      </Center>
    </div>
  );

  const elBody = (
    <div {...styles.body}>
      {elTitle}
      {elMarkdown}
    </div>
  );

  const elRight = def.refs && (
    <div {...styles.rightSidebar}>
      <MarkdownDoc instance={instance} markdown={def.refs} className={CLASS.VIDEO_DIAGRAM_REFS} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elBody}
      {elRight}
    </div>
  );
};
