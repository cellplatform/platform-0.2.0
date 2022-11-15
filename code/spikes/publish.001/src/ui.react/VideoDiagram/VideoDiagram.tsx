import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC, slug, Vimeo } from '../common';

export type VideoDiagramProps = {
  style?: t.CssValue;
};

export const VideoDiagram: React.FC<VideoDiagramProps> = (props) => {
  const [instance, setInstance] = useState<t.VimeoInstance>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const id = `foo.${slug()}`;
    const bus = rx.bus();
    const instance = { bus, id };
    const events = Vimeo.Events({ instance });
    setInstance(instance);
    return () => events.dispose();
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.format(1),
    }),
    zoom: css({
      Absolute: 0,
    }),
    video: css({
      Absolute: [null, null, 30, 30],
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.3)}`,
      boxShadow: `0 0px 16px 0 ${Color.alpha(COLORS.DARK, 0.06)}`,
      borderRadius: 10,
    }),
  };

  const videoId = 727951677; // TEMP 🐷
  const elVimeo = instance && (
    <Vimeo instance={instance} width={300} video={videoId} style={styles.video} />
  );

  return <div {...css(styles.base, props.style)}>{elVimeo}</div>;
};
