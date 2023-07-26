import '../../css.mjs';
import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

import { Player, Ui, Video, Vimeo } from '@vime/react';

import { SAMPLE } from './-dev/-Sample.mjs';

export const Root: React.FC<t.RootProps> = (props) => {
  const onTimeUpdate = (event: CustomEvent<number>) => {
    console.log('event', event);
    // setCurrentTime(event.detail);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      // padding: 8,
    }),
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

  const elVimeo = <Vimeo videoId={SAMPLE.VIMEO['app/tubes'].toString()} />;

  return (
    <div {...css(styles.base, props.style)}>
      <Player
        //
        // controls
        onVmCurrentTimeChange={onTimeUpdate}
      >
        {/* {elVideo} */}
        {elVimeo}
      </Player>
    </div>
  );
};
