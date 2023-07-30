import '../../css.mjs';
import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

import { useStateController } from './use.StateController.mjs';
import { Player, Ui, Video, Vimeo, Youtube } from '@vime/react';

import { SAMPLE } from './-dev/-Sample.mjs';

// type NumberEventArgs = CustomEvent<number>;

/**
 * Vime Docs:
 * https://vimejs.com/
 */
export const VideoPlayer: React.FC<t.VideoPlayerProps> = (props) => {
  const controller = useStateController();
  console.log('controller.ready', controller.ready);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  const elVideo = (
    <Video crossOrigin="" poster="https://media.vimejs.com/poster.png">
      {/* These are passed directly to the underlying HTML5 `<video>` element. */}
      {/* Why `data-src`? Lazy loading, you can always use `src` if you prefer.  */}
      <source data-src="https://media.vimejs.com/720p.mp4" type="video/mp4" />
      <track
        default
        kind="subtitles"
        src="https://media.vimejs.com/subs/english.vtt"
        srcLang="en"
        label="English"
      />
    </Video>
  );

  const elVimeo = (
    <Vimeo
      videoId={SAMPLE.VIMEO['app/tubes'].toString()}
      byline={false}
      cookies={false}
      portrait={false}
      tabIndex={-1} // NB: prevents focus on video and then keyboard/tab taking over within the embedded player.
      // style={{ borderRadius: 0 }}
    />
  );

  const elYouTube = <Youtube videoId={'FvmTSpJU-Xc'} />;

  return (
    <div {...css(styles.base, props.style)}>
      <Player
        {...controller.handlers}
        // onVmReady={onVmReady}
        // onVmCurrentTimeChange={onVmCurrentTimeChange}
        // onVmDurationChange={onVmDurationChange}
        style={{ borderRadius: 0 }}
      >
        {/* {elVideo} */}
        {elVimeo}
        {/* {elYouTube} */}
      </Player>
    </div>
  );
};
