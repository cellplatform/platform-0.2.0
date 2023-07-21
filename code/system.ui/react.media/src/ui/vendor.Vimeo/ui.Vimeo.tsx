import { useEffect, useRef, useState } from 'react';
import { distinctUntilChanged } from 'rxjs/operators';
import { FC, css, type t } from './common';
import { IconOverlay } from './components/IconOverlay';
import { ThumbnailOverlay } from './components/ThumbnailOverlay';
import { useIconController, usePlayerController } from './hooks';
import { VimeoPlayer } from './libs.mjs';
import { VimeoEvents } from './logic.Events.mjs';

/**
 * Wrapper for the Vimeo player API.
 * https://github.com/vimeo/player.js
 */
const View: React.FC<t.VimeoProps> = (props) => {
  const { instance, video, width, height, borderRadius, muted } = props;
  const divRef = useRef<HTMLDivElement>(null);

  const [player, setPlayer] = useState<VimeoPlayer>();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    const div = divRef.current as HTMLDivElement;

    const player = new VimeoPlayer(div, {
      id: video,
      width,
      height,
      controls: false,
      transparent: true,
      title: false,
      byline: false,
      portrait: false,
      loop: false,
      dnt: true, // Do Not Track ("no cookies" or other tracking attempts).
    });

    setPlayer(player);

    return () => {
      player?.destroy();
    };
  }, [width, height]); // eslint-disable-line

  const controller = usePlayerController({ instance, video, player });

  useEffect(() => {
    const events = VimeoEvents({ instance });
    const status$ = events.status.$;

    if (player && typeof video === 'number') {
      events.load.fire(video, { muted });
    }

    status$
      .pipe(distinctUntilChanged((prev, next) => prev.playing === next.playing))
      .subscribe((e) => {
        setIsPlaying(e.playing);
      });

    return () => events.dispose();
  }, [video, player]); // eslint-disable-line

  useEffect(() => {
    if (player) player.setMuted(props.muted ?? false);
  }, [player, props.muted]);

  const styles = {
    base: css({
      lineHeight: 0, // NB: Prevents space below IFrame.
      position: 'relative',
      overflow: 'hidden',
      borderRadius,
      width,
      height,
      opacity: controller.opacity,
      transition: `opacity 200ms ease`,
      ':first-child': { transform: `scale(${props.scale ?? 1})` },
    }),
    container: css({ width, height, position: 'relative' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div ref={divRef} {...styles.container}></div>
      <IconOverlay icon={props.icon} onClick={props.onIconClick} />
      <ThumbnailOverlay href={props.thumbnail} isPlaying={isPlaying} />
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  Events: t.VimeoEventsFactory;
  useIconController: t.UseVimeoIconController;
};
export const Vimeo = FC.decorate<t.VimeoProps, Fields>(
  View,
  { Events: VimeoEvents, useIconController },
  { displayName: 'Vimeo.Player' },
);
