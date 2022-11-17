import { useEffect, useState } from 'react';

import { Color, COLORS, css, rx, slug, t, Vimeo, KeyListener, Center } from '../common';
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
  const [baseOpacity, setBaseOpacity] = useState(0);
  const [vimeo, setVimeo] = useState<t.VimeoEvents>();
  const [percent, setPercent] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayComplete = percent === 1;

  /**
   * Lifecycle
   */
  useEffect(() => {
    const bus = rx.bus();
    const instance = { bus, id: `diagram-video.${slug()}` };
    const vimeo = Vimeo.Events({ instance });
    setVimeo(vimeo);
    setInstance(instance);

    const getCurrent = async () => (await vimeo.status.get()).status;
    const onReady = async () => {
      setBaseOpacity(1);
      if (props.autoStart) vimeo.play.fire();
      props.onReady?.(vimeo);
    };

    /**
     * Playing.
     */
    vimeo.status.$.subscribe((e) => setPercent(e.percent));
    vimeo.status.playing$.subscribe((e) => setIsPlaying(e.playing));

    /**
     * TODO 🐷
     * - Vimeo: have a ".seek.fire(-5)"
     *   Where the negative number is interpreted to mena "from end" (duration - value).
     */

    /**
     * Keyboard Behavior
     */
    const keydown = KeyListener.keydown(async (e) => {
      if (e.key === ' ') {
        const info = await getCurrent();
        const isPlaying = info?.playing;
        if (isPlaying) {
          vimeo.pause.fire();
        } else {
          vimeo.play.fire();
        }
      }
    });

    /**
     * Start.
     */
    vimeo.status.loaded$.subscribe((e) => onReady());

    /**
     * Dispose (end of life).
     */
    return () => {
      vimeo.dispose();
      keydown.dispose();
    };
  }, []);

  if (!instance || !props.video) return null;

  /**
   * Handlers
   */
  const replay = () => {
    vimeo?.seek.fire(0);
    vimeo?.play.fire();
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      Flex: 'x-stretch-stretch',
      opacity: baseOpacity,
      transition: `opacity 300ms`,
      overflow: 'hidden',
    }),
    player: css({
      pointerEvents: isPlaying ? 'all' : 'none',
      opacity: isPlaying || !isPlayComplete ? 1 : 0,
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
    replay: css({
      Absolute: 0,
      userSelect: 'none',
      backgroundColor: Color.format(0.3),
      backdropFilter: `blur(8)`,
      borderRadius: 10,
      border: `dashed 1px ${Color.alpha(COLORS.DARK, 0.2)}`,
      display: 'flex',
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

  const elReplay = (
    <div {...styles.replay} onClick={replay}>
      <Center flex={1}>
        <Icons.Replay size={85} color={Color.alpha(COLORS.DARK, 0.2)} />
      </Center>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elReplay}
      <div {...styles.player}>
        {elVimeo}
        {elIcons}
      </div>
    </div>
  );
};
