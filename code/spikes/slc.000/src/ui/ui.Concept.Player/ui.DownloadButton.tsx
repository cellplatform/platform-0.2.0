import { useState } from 'react';
import { DEFAULTS, Button, COLORS, Color, Icons, css, type t, File } from './common';

export type DownloadButtonProps = {
  data?: t.DownloadFileProps;
  downloadOnClick?: boolean;
  style?: t.CssValue;
};

export const DownloadButton: React.FC<DownloadButtonProps> = (props) => {
  const { data, downloadOnClick = DEFAULTS.downloadOnClick } = props;
  if (!data) return null;

  const [isOver, setOver] = useState(false);

  /**
   * Handlers
   */
  const handleClick = () => {
    const { url, kind, filename } = data;
    const mimetype = Wrangle.mimetype(kind);
    data.onClick?.({ url, mimetype });
    if (downloadOnClick) File.downloadUrl(url, filename);
  };

  /**
   * [Render]
   */
  const color = isOver ? COLORS.BLUE : Color.alpha(COLORS.DARK, 0.5);
  const styles = {
    base: css({ display: 'grid', placeItems: 'center' }),
    body: css({
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: 'auto auto',
      columnGap: 3,
    }),
    kind: css({ fontSize: 12, fontWeight: 'bold', color }),
  };

  const elBody = (
    <div {...styles.body}>
      <Icons.Download.Tray size={20} color={color} />
      <div {...styles.kind}>{data.kind.toUpperCase()}</div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Button onClick={handleClick} onMouse={(e) => setOver(e.isOver)}>
        {elBody}
      </Button>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  mimetype(kind: t.DownloadFileProps['kind']) {
    if (kind === 'pdf') return 'application/pdf';
    return 'application/octet-stream'; // Unknown.
  },
} as const;
