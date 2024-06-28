import { useState } from 'react';
import { useDragTarget } from '../../ui.use';
import { COLORS, Color, Filesize, Hash, css, type t, Button, Icons } from './common';

const RED = `#FF0000`;

export type DropProps = {
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onDrop?: t.HashDropHandler;
};

export const Drop: React.FC<DropProps> = (props) => {
  const [hash, setHash] = useState('');
  const [data, setData] = useState<Uint8Array | undefined>();

  const drag = useDragTarget({
    onDrop(e) {
      const data = e.files[0].data;
      const hash = Hash.sha256(data);
      const bytes = data.byteLength;
      const size = { bytes, display: Filesize(data.byteLength) };
      props.onDrop?.({ hash, data, size });
      setHash(hash);
      setData(data);
    },
  });

  const handleClipboardCopy = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
  };

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
      boxSizing: 'border-box',
      fontSize: 60,
      padding: '1em',
      color: theme.fg,
    }),
    message: css({
      Padding: [20, 50],
      letterSpacing: -0.6,
      wordBreak: 'break-all',
      marginBottom: '0.25em',
      backgroundColor: Color.alpha(COLORS.DARK, 0.03),
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.03)}`,
    }),
    copyButton: css({
      position: 'relative',
      Size: 48,
      display: 'grid',
      placeItems: 'center',
      color: theme.fg,
      ':hover': { color: COLORS.BLUE },
    }),
  };

  const message = wrangle.message(hash, drag.is.over);

  const elCopyButton = hash && (
    <Button onClick={handleClipboardCopy}>
      <div {...styles.copyButton}>
        <Icons.Copy size={50} />
      </div>
    </Button>
  );

  return (
    <div ref={drag.ref} {...css(styles.base, props.style)}>
      <div>
        <div {...styles.message}>
          {message} {elCopyButton}
        </div>
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  message(input: string, isDragOver: boolean) {
    if (isDragOver) return '(drop file now)';
    if (!input) return 'drag and drop file';

    const HIGHLIGHT = 4;
    const [prefix, hash] = input.split('-');
    const start = hash.slice(0, -HIGHLIGHT);
    const end = hash.slice(-HIGHLIGHT);

    const styles = { highlight: css({ color: RED }) };
    return (
      <>
        <span {...styles.highlight}>{prefix}</span>
        <span>{'-'}</span>
        <span>{start}</span>
        <span {...styles.highlight}>{end}</span>
      </>
    );
  },
} as const;
