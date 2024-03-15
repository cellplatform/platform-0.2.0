import '@tldraw/tldraw/tldraw.css';

import { Tldraw } from '@tldraw/tldraw';
import { css, type t } from './common';

export const View: React.FC<t.CanvasProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative', display: 'grid' }),
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
