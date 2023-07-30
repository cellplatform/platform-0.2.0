import { Player, Vimeo, Youtube } from '@vime/react';

import { css, type t } from './common';
import { useStateController } from './use.StateController.mjs';

/**
 * Vime Docs:
 * https://vimejs.com/
 */
export const View: React.FC<t.VideoPlayerProps> = (props) => {
  const { video } = props;

  const controller = useStateController({ video });

  if (!video || video.kind === 'Unknown' || !video.id) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  const elVimeo = video.kind === 'Vimeo' && (
    <Vimeo
      videoId={video.id}
      byline={false}
      cookies={false}
      portrait={false}
      tabIndex={-1} // NB: prevents focus on video and then keyboard/tab taking over within the embedded player.
    />
  );

  const elYouTube = video.kind === 'YouTube' && <Youtube videoId={video.id} />;

  return (
    <div {...css(styles.base, props.style)}>
      <Player {...controller.handlers}>
        {elVimeo}
        {elYouTube}
      </Player>
    </div>
  );
};
