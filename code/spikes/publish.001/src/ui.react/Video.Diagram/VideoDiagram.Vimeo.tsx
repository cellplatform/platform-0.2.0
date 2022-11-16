import { useEffect, useState } from 'react';

import { Color, COLORS, css, rx, slug, t, Vimeo } from '../common';
import { Icons } from '../Icons.mjs';

export type VideoDiagramVimeoProps = {
  video: t.VimeoId;
  dimmed?: boolean;
  muted?: boolean;
  autoStart?: boolean;
  style?: t.CssValue;
  onReady?: (e: t.VimeoEvents) => void;
};

export const VideoDiagramVimeo: React.FC<VideoDiagramVimeoProps> = (props) => {
  const { dimmed = false, muted = false } = props;

  const [instance, setInstance] = useState<t.VimeoInstance>();
  const [opacity, setOpacity] = useState(0);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const bus = rx.bus();
    const instance = { bus, id: `diagram-video.${slug()}` };
    const vimeo = Vimeo.Events({ instance });
    setInstance(instance);

    vimeo.status.loaded$.subscribe((e) => {
      /**
       * READY
       */
      setOpacity(1);
      props.onReady?.(vimeo);
      if (props.autoStart) vimeo.play.fire();
    });

    return () => vimeo.dispose();
  }, []);

  if (!instance || !props.video) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      Flex: 'x-stretch-stretch',
      opacity,
      transition: `opacity 300ms`,
    }),
    vimeo: css({
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.3)}`,
      boxShadow: `0 0px 16px 0 ${Color.alpha(COLORS.DARK, 0.06)}`,
      borderRadius: 10,
    }),
    icons: css({
      Absolute: [7, 7, null, null],
      Flex: 'x-center-center',
    }),
  };

  const elVimeo = (
    <Vimeo instance={instance} width={300} muted={muted} video={props.video} style={styles.vimeo} />
  );

  const elIcons = (
    <div {...styles.icons}>
      <div>{muted && <Icons.Muted size={36} />}</div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elVimeo}
      {elIcons}
    </div>
  );
};
