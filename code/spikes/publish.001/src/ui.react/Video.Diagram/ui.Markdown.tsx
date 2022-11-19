import { useEffect, useState } from 'react';
import { Center, css, DEFAULTS, Processor, t } from '../common';

const CLASS = DEFAULTS.MD.CLASS;

export type VideoDiagramMarkdownProps = {
  dimmed?: boolean;
  markdown?: string;
  style?: t.CssValue;
};

export const VideoDiagramMarkdown: React.FC<VideoDiagramMarkdownProps> = (props) => {
  const { dimmed } = props;
  const [safeHtml, setSafeHtml] = useState('');

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    if (props.markdown) {
      Processor.toHtml(props.markdown).then((e) => setSafeHtml(e.html));
    } else {
      setSafeHtml(''); // Reset.
    }
  }, [props.markdown]);

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
        <div dangerouslySetInnerHTML={{ __html: safeHtml }} className={CLASS.VIDEO_DIAGRAM} />
      </Center>
    </div>
  );
};
