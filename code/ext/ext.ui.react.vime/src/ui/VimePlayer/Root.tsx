import '../../css.mjs';
import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

import { Player, Ui, Video } from '@vime/react';

/**
 * Vime Docs:
 * https://vimejs.com/4.x/getting-started/installation#react
 */
export const Root: React.FC<t.RootProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 8,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Player>
        {/* Provider component is placed here. */}

        <Video crossOrigin="" poster="https://media.vimejs.com/poster.png" />

        <Ui>{/* UI components are placed here. */}</Ui>
      </Player>
    </div>
  );
};
