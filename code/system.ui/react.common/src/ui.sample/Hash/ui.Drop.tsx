import { useState } from 'react';
import { useDragTarget } from '../../ui/useDragTarget';
import { Color, COLORS, Hash, css, type t } from '../common';
import { Filesize } from 'sys.fs';

export type DropProps = {
  style?: t.CssValue;
  onDrop?: (e: { hash: string; data: Uint8Array }) => void;
};

export const Drop: React.FC<DropProps> = (props) => {
  const [hash, setHash] = useState('');
  const [data, setData] = useState<Uint8Array | undefined>();

  const drag = useDragTarget({
    onDrop(e) {
      const data = e.files[0].data;
      const hash = Hash.sha256(data);
      props.onDrop?.({ hash, data });
      setHash(hash);
      setData(data);
    },
  });

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
      boxSizing: 'border-box',
      fontSize: 60,
      padding: '1em',
    }),
    message: css({
      Padding: [20, 50],
      letterSpacing: -0.6,
      wordBreak: 'break-all',
      marginBottom: '0.25em',
      backgroundColor: Color.alpha(COLORS.DARK, 0.03),
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.03)}`,
    }),
  };

  const message = drag.is.over ? '(drop file now)' : hash ? hash : 'drag and drop file';

  return (
    <div ref={drag.ref} {...css(styles.base, props.style)}>
      <div>
        <div {...styles.message}>{message}</div>
        {data && <div {...styles.message}>{Filesize(data.byteLength)}</div>}
      </div>
    </div>
  );
};
