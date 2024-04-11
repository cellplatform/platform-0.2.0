import '@tldraw/tldraw/tldraw.css';
import { useRef } from 'react';

import { Tldraw, setUserPreferences } from '@tldraw/tldraw';
import { Color, css, slug, type t } from './common';

export const View: React.FC<t.CanvasProps> = (props) => {
  const instance = useRef(slug());

  /**
   * https://tldraw.dev/docs/editor#Turn-on-dark-mode
   * https://discord.com/channels/859816885297741824/859816885801713728/1219772189985869864
   */
  setUserPreferences({
    id: instance.current,
    isDarkMode: props.theme === 'Dark',
  });

  /**
   * Render
   */
  const styles = {
    base: css({
      color: Color.fromTheme(props.theme),
      position: 'relative',
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)} className={'tldraw__editor'}>
      <Tldraw
        store={props.store}
        onMount={(e) => {
          console.info(`⚡️ Tldraw.onMount:`, e);
        }}
      />
    </div>
  );
};
