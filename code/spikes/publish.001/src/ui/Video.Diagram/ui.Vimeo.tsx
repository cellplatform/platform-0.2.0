import { useEffect, useState } from 'react';

import { Center, Color, COLORS, css, rx, slug, t, Vimeo, FC } from '../common';
import { Icons } from '../Icons.mjs';
import { VideoDiagramKeyboard } from './Keyboard.mjs';

const HEIGHT = 170;

export type VideoDiagramVimeoProps = {
  video: t.VimeoId;
  dimmed?: boolean;
  muted?: boolean;
  autoStart?: boolean;
  style?: t.CssValue;
  onReady?: (e: t.VimeoEvents) => void;
};

const View: React.FC<VideoDiagramVimeoProps> = (props) => {
  const { dimmed = false, muted = false } = props;

  const [instance, setInstance] = useState<t.VimeoInstance>();
  const [baseOpacity, setBaseOpacity] = useState(0);
  const [vimeo, setVimeo] = useState<t.VimeoEvents>();
  const [vimeoStatus, setVimeoStatus] = useState<t.VimeoStatus | undefined>();
  const percent = vimeoStatus?.percent ?? 0;
  const isPlaying = vimeoStatus?.playing ?? false;
  const isPlayComplete = percent === 1;
  const isPlayerVisible = isPlaying || !isPlayComplete;

  /**
   * Lifecycle
   */
  useEffect(() => {
    const bus = rx.bus();
    const instance = { bus, id: `diagram-video.${slug()}` };
    const vimeo = Vimeo.Events({ instance });
    setVimeo(vimeo);
    setInstance(instance);

    const onReady = async () => {
      setBaseOpacity(1);
      if (props.autoStart) vimeo.play.fire();
      props.onReady?.(vimeo);
    };

    /**
     * Playing.
     */
    vimeo.status.$.subscribe((e) => setVimeoStatus(e));

    /**
     * Keyboard Behavior
     */
    const keyboard = VideoDiagramKeyboard.listen(vimeo);

    /**
     * Start.
     */
    vimeo.status.loaded$.subscribe((e) => onReady());

    /**
     * Dispose (end of life).
     */
    return () => {
      vimeo.dispose();
      keyboard.dispose();
    };
  }, []);

  if (!instance || !props.video) return null;

  /**
   * Handlers
   */
  const replay = () => {
    if (isPlayerVisible) return;
    vimeo?.seek.fire(0);
    vimeo?.play.fire();
  };

  const togglePlaying = async () => {
    vimeo?.play.toggle();
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      Flex: 'x-stretch-stretch',
      opacity: dimmed ? 0.4 : baseOpacity,
      transition: `opacity 300ms`,
      overflow: 'hidden',
    }),
    player: css({
      pointerEvents: isPlaying ? 'all' : 'none',
      opacity: isPlayerVisible ? 1 : 0,
      transition: `opacity 300ms`,
    }),
    playerClickTarget: css({
      Absolute: 0,
      pointerEvents: 'all',
    }),
    video: css({
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.3)}`,
      boxShadow: `0 0px 16px 0 ${Color.alpha(COLORS.DARK, 0.06)}`,
      borderRadius: 10,
      overflow: 'hidden',
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
      opacity: isPlayerVisible ? 0 : 1,
      transition: `opacity 300ms`,
      display: 'flex',
    }),
  };

  const elVimeo = (
    <div onClick={togglePlaying} {...styles.video}>
      <Vimeo instance={instance} height={HEIGHT} muted={muted} video={props.video} />
      <div {...styles.playerClickTarget} />
    </div>
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

/**
 * Export
 */

type Fields = {
  HEIGHT: number;
};
export const VideoDiagramVimeo = FC.decorate<VideoDiagramVimeoProps, Fields>(
  View,
  { HEIGHT },
  { displayName: 'VideoDiagramVimeo' },
);
