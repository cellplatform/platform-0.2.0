import { Player, Vimeo, Youtube } from '@vime/react';

import { DEFAULTS, css, type t } from './common';
import { useHasInteracted } from './use.HasInteracted.mjs';
import { useStateController } from './use.StateController.mjs';

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
    onChange,
    borderRadius = DEFAULTS.borderRadius,
    muted = DEFAULTS.muted,
  } = props;

  const hasInteracted = useHasInteracted();
  const controller = useStateController({
    video,
    playing,
    loop,
    timestamp,
    hasInteracted, // NB: for "autoplay policy" on <Video> element.
    onChange,
  });

  if (!video || video.kind === 'Unknown' || !video.id) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      opacity: controller.ready ? 1 : 0,
      transition: 'opacity 0.15s',
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

  const elVimeo = video.kind === 'Vimeo' && (
    <Vimeo
      key={`${video.kind}:${video.id}`}
      videoId={video.id}
      byline={false}
      cookies={false}
      portrait={false}
      tabIndex={-1} // NB: prevents focus on video and then keyboard/tab taking over within the embedded player.
    />
  );

  const elYouTube = video.kind === 'YouTube' && (
    <Youtube
      key={`${video.kind}:${video.id}`}
      //
      videoId={video.id}
      cookies={false}
      showFullscreenControl={false}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Player
        ref={controller.ref}
        muted={muted}
        style={customCssOverrides as any}
        {...controller.handlers}
      >
        {elVimeo}
        {elYouTube}
      </Player>
    </div>
  );
};
