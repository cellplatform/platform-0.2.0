import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

import { css, type t } from './common';

export const View: React.FC<t.CanvasProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Tldraw
        onMount={(e) => {
          console.log('onMount', e);
        }}
      />
    </div>
  );
};
