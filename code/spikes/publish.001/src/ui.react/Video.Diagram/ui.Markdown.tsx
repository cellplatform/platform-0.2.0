import { Center, css, DEFAULTS, t } from '../common';
import { MarkdownDoc } from '../Markdown.Doc';

const CLASS = DEFAULTS.MD.CLASS;

export type VideoDiagramMarkdownProps = {
  instance: t.Instance;
  dimmed?: boolean;
  markdown?: string;
  style?: t.CssValue;
};

export const VideoDiagramMarkdown: React.FC<VideoDiagramMarkdownProps> = (props) => {
  const { instance, dimmed } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      opacity: dimmed ? 0.4 : 1,
    }),
  };

  return (
    <div {...css(styles.base, props.style)} className={CLASS.ROOT}>
      <Center style={{ Absolute: 0 }} className={CLASS.BLOCK}>
        <MarkdownDoc
          instance={instance}
          markdown={props.markdown}
          className={CLASS.VIDEO_DIAGRAM}
        />
      </Center>
    </div>
  );
};
