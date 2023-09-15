import { put, type PutBlobResult } from '@vercel/blob';
import { useState } from 'react';
import { css, Spinner, useDragTarget, type t } from '../common';

export type SpecUploadProps = {
  style?: t.CssValue;
  onUploaded?: () => void;
};

/**
 * https://vercel.com/docs/storage/vercel-blob
 */
export const SpecUpload: React.FC<SpecUploadProps> = (props) => {
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [uploading, setUploading] = useState(false);

  const drag = useDragTarget({
    onDrop: async (e) => {
      const file = e.files[0];
      const baseUrl = 'https://blob.dev.db.team';
      const handleBlobUploadUrl = `${baseUrl}/api/write`;

      // setUploading(true);
      // const newBlob = await put(file.path, file.data, {
      //   access: 'public',
      //   handleBlobUploadUrl,
      // });

      // setBlob(newBlob);
      setUploading(false);
      props.onUploaded?.();
    },
  });

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', display: 'grid', placeItems: 'center' }),
    info: css({ Absolute: [15, null, null, 15] }),
    message: css({ userSelect: 'none', pointerEvents: 'none' }),
    spinner: css({ Absolute: 0, display: 'grid', placeItems: 'center' }),
  };

  const elInfo = blob && (
    <div {...styles.info}>
      <a href={blob.url} target={'_blank'} rel={'noopener noreferrer'}>
        {blob.url}
      </a>
    </div>
  );

  const elSpinner = uploading && (
    <div {...styles.spinner}>
      <Spinner.Bar />
    </div>
  );

  const elMessage = !elSpinner && (
    <div {...styles.message}>{!drag.is.over ? 'Drop file to upload' : 'Drop file...'}</div>
  );

  return (
    <div {...css(styles.base, props.style)} ref={drag.ref}>
      {elSpinner || elInfo}
      {elMessage}
    </div>
  );
};
