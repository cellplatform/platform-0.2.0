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

    return () => {
      events.dispose();
    };
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      // backgroundColor: Color.alpha(COLORS.DARK, 0.03),
      backgroundColor: Color.format(1),
    }),
    video: css({
      Absolute: [30, null, null, 30],
      border: `solid 1px ${Color.format(-0.2)}`,
      borderRadius: 10,
      boxShadow: `0 0px 14px 0 ${Color.format(-0.1)}`,
    }),
  };

  const videoId = 727951677; // TEMP 🐷
  const elVimeo = instance && (
    <Vimeo instance={instance} width={300} video={videoId} style={styles.video} />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elVimeo}
      <div></div>
    </div>
  );
};
