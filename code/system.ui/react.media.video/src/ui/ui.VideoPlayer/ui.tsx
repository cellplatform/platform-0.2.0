import { Player, Vimeo, Youtube, Video } from '@vime/react';

import { DEFAULTS, css, type t } from './common';
import { useController } from './use.Controller.mjs';
import { useHasInteracted } from './use.HasInteracted.mjs';
import { Wrangle } from './Wrangle.mjs';

/**
 * Vime Docs:
 * https://vimejs.com
 */
export const View: React.FC<t.VideoPlayerProps> = (props) => {
  const {
    video,
    playing,
    loop,
    timestamp,
    onStatus,
    borderRadius = DEFAULTS.borderRadius,
    muted = DEFAULTS.muted,
    enabled = DEFAULTS.enabled,
    aspectRatio = DEFAULTS.aspectRatio,
    innerScale,
  } = props;
  const { width, height } = Wrangle.dimensions(aspectRatio, props.width, props.height);

  const hasInteracted = useHasInteracted();
  const controller = useController({
    video,
    enabled,
    playing,
    loop,
    muted,
    timestamp,
    hasInteracted, // NB: for "autoplay policy" on <Video> element.
    onStatus,
  });

  if (!video || video.kind === 'Unknown' || !video.ref) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      borderRadius,
      width,
      height,
      overflow: 'hidden',
      opacity: controller.ready ? (enabled ? 1 : 0.3) : 0,
      filter: enabled ? undefined : 'grayscale(100%)',
      transition: 'opacity 0.15s, filter 0.15s',
    }),
    body: css({
      transform: typeof innerScale === 'number' ? `scale(${innerScale})` : undefined,
    }),
  };
  /**
   * https://vimejs.com/components/core/player#css-custom-properties
   */
  const customCssOverrides = {
    '--vm-player-bg': 'transparent',
    '--vm-player-theme': 'transparent',
    '--vm-player-border-radius': `${borderRadius}px`,
    '--vm-player-box-shadow': 'none',
  };

  /**
   * https://vimejs.com/components/providers/video
   */
  const elVideo = video.kind === 'Video' && (
    <Video key={`${video.kind}:${video.ref}`}>
      <source src={video.ref} type={'video/mp4'} />
    </Video>
  );

  /**
   * https://vimejs.com/components/providers/vimeo
   * ↑ https://vimejs.com/components/core/embed
   */
  const elVimeo = video.kind === 'Vimeo' && (
    <Vimeo
      key={`${video.kind}:${video.ref}`}
      videoId={video.ref}
      byline={false}
      cookies={false}
      portrait={false}
      tabIndex={-1} // NB: prevents focus on video and then keyboard/tab taking over within the embedded player.
    />
  );

  /**
   * https://vimejs.com/components/providers/youtube
   * ↑ https://vimejs.com/components/core/embed
   */
  const elYouTube = video.kind === 'YouTube' && (
    <Youtube
      key={`${video.kind}:${video.ref}`}
      //
      videoId={video.ref}
      cookies={false}
      showFullscreenControl={false}
    />
  );

  /**
   * https://vimejs.com/components/core/player
   */
  const elPlayer = (
    <Player
      ref={controller.ref}
      muted={muted}
      controls={false}
      aspectRatio={aspectRatio}
      style={customCssOverrides as any}
      {...controller.handlers}
    >
      {elVideo}
      {elVimeo}
      {elYouTube}
    </Player>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>{elPlayer}</div>
    </div>
  );
};
